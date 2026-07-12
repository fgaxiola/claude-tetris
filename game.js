'use strict';

const COLS = 10;
const ROWS = 20;
const BLOCK = 30;

const COLORS = [
  null,
  '#4dd0e1', // I - cyan
  '#ffd54f', // O - yellow
  '#ba68c8', // T - purple
  '#81c784', // S - green
  '#e57373', // Z - red
  '#7986cb', // J - indigo
  '#ffb74d', // L - orange
  '#90a4ae', // N - ring
];

const PIECES = [
  null,
  [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], // I
  [[2,2],[2,2]],                               // O
  [[0,3,0],[3,3,3],[0,0,0]],                  // T
  [[0,4,4],[4,4,0],[0,0,0]],                  // S
  [[5,5,0],[0,5,5],[0,0,0]],                  // Z
  [[6,0,0],[6,6,6],[0,0,0]],                  // J
  [[0,0,7],[7,7,7],[0,0,0]],                  // L
  [[8,8,8],[8,0,8],[8,8,8]],                  // N - ring
];

const LINE_SCORES = [0, 100, 300, 500, 800];

const POWERUP_INTERVAL = 1;    // lines needed to grant one PowerUp
const POWERUP_CELL_SCORE = 10; // flat points per cell destroyed by a PowerUp
const FREEZE_MS = 5000;
const POWERUP_TOAST_MS = 1000;
const POWERUP_NAMES = ['Bomb', 'Bolt', 'Tint', 'Gravity', 'Freeze'];

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('next-canvas');
const nextCtx = nextCanvas.getContext('2d');
const scoreEl = document.getElementById('score');
const linesEl = document.getElementById('lines');
const levelEl = document.getElementById('level');
const powerupToastEl = document.getElementById('powerup-toast');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayScore = document.getElementById('overlay-score');
const restartBtn = document.getElementById('restart-btn');
const themeToggleBtn = document.getElementById('theme-toggle');

const THEME_KEY = 'tetris-theme';

let board, current, next, score, lines, level, paused, gameOver, lastTime, dropAccum, dropInterval, animId;
let gridLineColor, blockHighlightColor;
let armedTintColor, freezeUntil, powerupToastTimer;
let effects;

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  themeToggleBtn.textContent = theme === 'light' ? '☀️' : '🌙';
  gridLineColor = cssVar('--grid-line');
  blockHighlightColor = cssVar('--block-highlight');
}

function initTheme() {
  applyTheme(document.documentElement.getAttribute('data-theme') || 'dark');
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

function createBoard() {
  return Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
}

function randomPiece() {
  const type = Math.floor(Math.random() * (PIECES.length - 1)) + 1;
  const shape = PIECES[type].map(row => [...row]);
  return { type, shape, x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2), y: 0 };
}

function collide(shape, ox, oy) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const nx = ox + c;
      const ny = oy + r;
      if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
      if (ny >= 0 && board[ny][nx]) return true;
    }
  }
  return false;
}

function rotateCW(shape) {
  const rows = shape.length, cols = shape[0].length;
  const result = Array.from({ length: cols }, () => new Array(rows).fill(0));
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      result[c][rows - 1 - r] = shape[r][c];
  return result;
}

function tryRotate() {
  const rotated = rotateCW(current.shape);
  const kicks = [0, -1, 1, -2, 2];
  for (const kick of kicks) {
    if (!collide(rotated, current.x + kick, current.y)) {
      current.shape = rotated;
      current.x += kick;
      return;
    }
  }
}

function merge() {
  for (let r = 0; r < current.shape.length; r++)
    for (let c = 0; c < current.shape[r].length; c++)
      if (current.shape[r][c])
        board[current.y + r][current.x + c] = current.shape[r][c];
}

function addEffect(type, data, duration) {
  effects.push({ type, data, duration, start: performance.now() });
}

function detonateTint(fullRows) {
  if (!armedTintColor) return;
  if (!fullRows.some(r => board[r].includes(armedTintColor))) return;
  const color = armedTintColor;
  armedTintColor = 0;
  const cells = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (board[r][c] === color) {
        board[r][c] = 0;
        score += POWERUP_CELL_SCORE;
        cells.push({ r, c });
      }
  addEffect('tintFire', { color, cells }, 350);
}

function clearLines() {
  const fullRows = [];
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every(v => v !== 0)) fullRows.push(r);
  }
  detonateTint(fullRows);

  let cleared = 0;
  for (const r of fullRows) {
    board.splice(r + cleared, 1);
    board.unshift(new Array(COLS).fill(0));
    cleared++;
  }
  if (cleared) {
    lines += cleared;
    score += (LINE_SCORES[cleared] || 0) * level;
    level = Math.floor(lines / 10) + 1;
    dropInterval = Math.max(100, 1000 - (level - 1) * 90);
    updateHUD();
  }
}

function ghostY() {
  let gy = current.y;
  while (!collide(current.shape, current.x, gy + 1)) gy++;
  return gy;
}

function hardDrop() {
  const gy = ghostY();
  score += (gy - current.y) * 2;
  current.y = gy;
  lockPiece();
}

function softDrop() {
  if (!collide(current.shape, current.x, current.y + 1)) {
    current.y++;
    score += 1;
    updateHUD();
  } else {
    lockPiece();
  }
}

function lockCenter() {
  return {
    x: current.x + Math.floor(current.shape[0].length / 2),
    y: current.y + Math.floor(current.shape.length / 2),
  };
}

function clearCell(r, c) {
  if (board[r][c]) {
    board[r][c] = 0;
    score += POWERUP_CELL_SCORE;
  }
}

function doBomb(center) {
  const cx = Math.min(Math.max(center.x, 1), COLS - 2);
  const cy = Math.min(Math.max(center.y, 1), ROWS - 2);
  const cells = [];
  for (let r = cy - 1; r <= cy + 1; r++)
    for (let c = cx - 1; c <= cx + 1; c++) {
      clearCell(r, c);
      cells.push({ r, c });
    }
  addEffect('bomb', { cx, cy, cells }, 450);
}

function doBolt(center) {
  const cells = [];
  const horizontal = Math.random() < 0.5;
  if (horizontal) {
    for (let c = 0; c < COLS; c++) { clearCell(center.y, c); cells.push({ r: center.y, c }); }
  } else {
    for (let r = 0; r < ROWS; r++) { clearCell(r, center.x); cells.push({ r, c: center.x }); }
  }
  addEffect('bolt', { horizontal, index: horizontal ? center.y : center.x, cells }, 300);
}

function doTint() {
  const present = new Set();
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (board[r][c]) present.add(board[r][c]);
  if (present.size === 0) return;
  const colors = [...present];
  armedTintColor = colors[Math.floor(Math.random() * colors.length)];
  const cells = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (board[r][c] === armedTintColor) cells.push({ r, c });
  addEffect('tintArm', { color: armedTintColor, cells }, 500);
}

function doGravity() {
  const moves = [];
  for (let c = 0; c < COLS; c++) {
    const filled = [];
    for (let r = 0; r < ROWS; r++)
      if (board[r][c]) filled.push({ r, value: board[r][c] });
    for (let r = 0; r < ROWS; r++)
      board[r][c] = 0;
    for (let i = 0; i < filled.length; i++) {
      const toRow = ROWS - filled.length + i;
      board[toRow][c] = filled[i].value;
      if (filled[i].r !== toRow) moves.push({ c, fromRow: filled[i].r, toRow, value: filled[i].value });
    }
  }
  addEffect('gravity', { moves }, 350);
  clearLines();
}

function doFreeze() {
  freezeUntil = performance.now() + FREEZE_MS;
  addEffect('freezeCast', {}, 300);
}

function showPowerUpToast(name) {
  powerupToastEl.textContent = name;
  powerupToastEl.classList.add('show');
  clearTimeout(powerupToastTimer);
  powerupToastTimer = setTimeout(() => powerupToastEl.classList.remove('show'), POWERUP_TOAST_MS);
}

function grantPowerUp(center) {
  const roll = Math.floor(Math.random() * 5);
  switch (roll) {
    case 0: doBomb(center); break;
    case 1: doBolt(center); break;
    case 2: doTint(); break;
    case 3: doGravity(); break;
    case 4: doFreeze(); break;
  }
  showPowerUpToast(POWERUP_NAMES[roll]);
  updateHUD();
}

function lockPiece() {
  const center = lockCenter();
  merge();
  const prevLines = lines;
  clearLines();
  if (Math.floor(lines / POWERUP_INTERVAL) > Math.floor(prevLines / POWERUP_INTERVAL)) {
    grantPowerUp(center);
  }
  spawn();
}

function spawn() {
  current = next;
  next = randomPiece();
  if (collide(current.shape, current.x, current.y)) {
    endGame();
  }
  drawNext();
}

function updateHUD() {
  scoreEl.textContent = score.toLocaleString();
  linesEl.textContent = lines;
  levelEl.textContent = level;
}

function drawBlock(context, x, y, colorIndex, size, alpha) {
  if (!colorIndex) return;
  const color = COLORS[colorIndex];
  context.globalAlpha = alpha ?? 1;
  context.fillStyle = color;
  context.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
  // highlight
  context.fillStyle = blockHighlightColor;
  context.fillRect(x * size + 1, y * size + 1, size - 2, 4);
  context.globalAlpha = 1;
}

function drawGrid() {
  ctx.strokeStyle = gridLineColor;
  ctx.lineWidth = 0.5;
  for (let c = 1; c < COLS; c++) {
    ctx.beginPath();
    ctx.moveTo(c * BLOCK, 0);
    ctx.lineTo(c * BLOCK, ROWS * BLOCK);
    ctx.stroke();
  }
  for (let r = 1; r < ROWS; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * BLOCK);
    ctx.lineTo(COLS * BLOCK, r * BLOCK);
    ctx.stroke();
  }
}

function fillCell(r, c, color, alpha) {
  ctx.globalAlpha = alpha ?? 1;
  ctx.fillStyle = color;
  ctx.fillRect(c * BLOCK + 1, r * BLOCK + 1, BLOCK - 2, BLOCK - 2);
  ctx.globalAlpha = 1;
}

function strokeCellRect(r, c, w, h, color, alpha, lineWidth) {
  ctx.globalAlpha = alpha ?? 1;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth ?? 2;
  ctx.strokeRect(c * BLOCK, r * BLOCK, w * BLOCK, h * BLOCK);
  ctx.globalAlpha = 1;
}

function renderBomb(data, p, frame) {
  const { cx, cy, cells } = data;
  const flash = frame % 2 === 0 ? '#fff176' : '#ff7043';
  const alpha = Math.max(0, 1 - p);
  for (const { r, c } of cells) fillCell(r, c, flash, alpha);
  const ring = Math.min(2, Math.floor(p * 3));
  strokeCellRect(cy - 1 - ring, cx - 1 - ring, 3 + ring * 2, 3 + ring * 2, '#ff7043', Math.max(0, 0.8 - p * 0.8), 3);
}

function renderBolt(data, p, frame) {
  const { horizontal, index, cells } = data;
  if (frame % 2 === 0) {
    const color = frame % 4 === 0 ? '#ffffff' : '#fff176';
    const alpha = Math.max(0, 1 - p);
    for (const { r, c } of cells) fillCell(r, c, color, alpha);
  }
  ctx.globalAlpha = Math.max(0, 1 - p);
  ctx.strokeStyle = '#fff176';
  ctx.lineWidth = 3;
  ctx.beginPath();
  const jitter = (frame % 2 === 0) ? 4 : -4;
  if (horizontal) {
    const y = index * BLOCK + BLOCK / 2;
    ctx.moveTo(0, y - jitter);
    for (let x = 0; x <= COLS * BLOCK; x += BLOCK) ctx.lineTo(x, y + (x / BLOCK % 2 === 0 ? jitter : -jitter));
  } else {
    const x = index * BLOCK + BLOCK / 2;
    ctx.moveTo(x - jitter, 0);
    for (let y = 0; y <= ROWS * BLOCK; y += BLOCK) ctx.lineTo(x + (y / BLOCK % 2 === 0 ? jitter : -jitter), y);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function renderTintArm(data, p, frame) {
  const { color, cells } = data;
  const pulse = frame % 2 === 0 ? 0 : 4;
  const alpha = Math.max(0, 0.9 - p * 0.9);
  for (const { r, c } of cells) {
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = COLORS[color];
    ctx.lineWidth = 3;
    ctx.strokeRect(c * BLOCK - pulse / 2, r * BLOCK - pulse / 2, BLOCK + pulse, BLOCK + pulse);
    ctx.globalAlpha = 1;
  }
}

function renderTintFire(data, p, frame) {
  const { cells } = data;
  const alpha = Math.max(0, 1 - p);
  if (frame % 2 === 0) for (const { r, c } of cells) fillCell(r, c, '#ffffff', alpha);
}

function renderGravity(data, p) {
  const steps = 6;
  const step = Math.min(steps - 1, Math.floor(p * steps));
  for (const { c, fromRow, toRow, value } of data.moves) {
    const row = fromRow + Math.round((toRow - fromRow) * (step / (steps - 1)));
    drawBlock(ctx, c, row, value, BLOCK);
  }
}

function renderFreezeCast(data, p) {
  ctx.globalAlpha = Math.max(0, 0.5 - p * 0.5);
  ctx.fillStyle = '#4dd0e1';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;
}

const EFFECT_RENDERERS = {
  bomb: renderBomb,
  bolt: renderBolt,
  tintArm: renderTintArm,
  tintFire: renderTintFire,
  gravity: renderGravity,
  freezeCast: renderFreezeCast,
};

function renderEffects(ts) {
  effects = effects.filter(e => ts - e.start < e.duration);
  for (const e of effects) {
    const p = (ts - e.start) / e.duration;
    const frame = Math.floor(p * 8);
    EFFECT_RENDERERS[e.type](e.data, p, frame);
  }
}

function drawFreezeOverlay(ts) {
  if (ts >= freezeUntil) return;
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = '#4dd0e1';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;
  const blink = Math.floor(ts / 250) % 2 === 0;
  ctx.fillStyle = blink ? '#4dd0e1' : '#b3e5fc';
  const s = 8;
  for (let x = 0; x < canvas.width; x += s * 2) {
    ctx.fillRect(x, 0, s, s);
    ctx.fillRect(x, canvas.height - s, s, s);
  }
  for (let y = 0; y < canvas.height; y += s * 2) {
    ctx.fillRect(0, y, s, s);
    ctx.fillRect(canvas.width - s, y, s, s);
  }
}

function draw(ts) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  const bombEffect = effects.find(e => e.type === 'bomb' && (ts - e.start) / e.duration < 0.4);
  if (bombEffect) {
    const shakeFrame = Math.floor(ts / 50);
    const sx = (shakeFrame % 2 === 0 ? 1 : -1) * 3;
    const sy = (shakeFrame % 3 === 0 ? -1 : 1) * 3;
    ctx.translate(sx, sy);
  }

  drawGrid();

  // board
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      drawBlock(ctx, c, r, board[r][c], BLOCK);

  renderEffects(ts);

  // ghost
  const gy = ghostY();
  for (let r = 0; r < current.shape.length; r++)
    for (let c = 0; c < current.shape[r].length; c++)
      if (current.shape[r][c])
        drawBlock(ctx, current.x + c, gy + r, current.shape[r][c], BLOCK, 0.2);

  // current piece
  for (let r = 0; r < current.shape.length; r++)
    for (let c = 0; c < current.shape[r].length; c++)
      drawBlock(ctx, current.x + c, current.y + r, current.shape[r][c], BLOCK);

  ctx.restore();

  drawFreezeOverlay(ts);
}

function drawNext() {
  const NB = 30;
  nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
  const shape = next.shape;
  const offX = Math.floor((4 - shape[0].length) / 2);
  const offY = Math.floor((4 - shape.length) / 2);
  for (let r = 0; r < shape.length; r++)
    for (let c = 0; c < shape[r].length; c++)
      drawBlock(nextCtx, offX + c, offY + r, shape[r][c], NB);
}

function endGame() {
  gameOver = true;
  cancelAnimationFrame(animId);
  overlayTitle.textContent = 'GAME OVER';
  overlayScore.textContent = `Puntuación: ${score.toLocaleString()}`;
  overlay.classList.remove('hidden');
}

function togglePause() {
  if (gameOver) return;
  paused = !paused;
  if (!paused) {
    lastTime = performance.now();
    loop(lastTime);
  } else {
    cancelAnimationFrame(animId);
    overlayTitle.textContent = 'PAUSA';
    overlayScore.textContent = '';
    overlay.classList.remove('hidden');
  }
}

function loop(ts) {
  const dt = ts - lastTime;
  lastTime = ts;
  if (ts < freezeUntil) {
    dropAccum = 0;
  } else {
    dropAccum += dt;
  }
  if (dropAccum >= dropInterval) {
    dropAccum = 0;
    if (!collide(current.shape, current.x, current.y + 1)) {
      current.y++;
    } else {
      lockPiece();
    }
  }
  if (gameOver) return;
  draw(ts);
  animId = requestAnimationFrame(loop);
}

function init() {
  board = createBoard();
  score = 0;
  lines = 0;
  level = 1;
  paused = false;
  gameOver = false;
  dropInterval = 1000;
  dropAccum = 0;
  armedTintColor = 0;
  freezeUntil = 0;
  effects = [];
  clearTimeout(powerupToastTimer);
  powerupToastEl.classList.remove('show');
  lastTime = performance.now();
  next = randomPiece();
  spawn();
  updateHUD();
  overlay.classList.add('hidden');
  cancelAnimationFrame(animId);
  animId = requestAnimationFrame(loop);
}

document.addEventListener('keydown', e => {
  if (e.code === 'KeyP') { togglePause(); return; }
  if (paused || gameOver) return;
  switch (e.code) {
    case 'ArrowLeft':
      if (!collide(current.shape, current.x - 1, current.y)) current.x--;
      break;
    case 'ArrowRight':
      if (!collide(current.shape, current.x + 1, current.y)) current.x++;
      break;
    case 'ArrowDown':
      softDrop();
      break;
    case 'ArrowUp':
    case 'KeyX':
      tryRotate();
      break;
    case 'Space':
      e.preventDefault();
      hardDrop();
      break;
  }
  updateHUD();
});

restartBtn.addEventListener('click', init);
themeToggleBtn.addEventListener('click', toggleTheme);

initTheme();
init();
