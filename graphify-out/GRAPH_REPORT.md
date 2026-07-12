# Graph Report - claude-tetris  (2026-07-11)

## Corpus Check
- 5 files · ~6,310 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 108 nodes · 174 edges · 11 communities
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d8a6ae26`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- game.js
- Tetris
- CLAUDE.md
- loop
- lockPiece
- collide
- spawn
- Cómo funciona
- grantPowerUp
- applyMute
- playChainSound

## God Nodes (most connected - your core abstractions)
1. `lockPiece()` - 10 edges
2. `Tetris` - 10 edges
3. `grantPowerUp()` - 9 edges
4. `addEffect()` - 8 edges
5. `clearLines()` - 8 edges
6. `spawn()` - 8 edges
7. `draw()` - 7 edges
8. `collide()` - 6 edges
9. `loop()` - 6 edges
10. `init()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `clearLines()` --calls--> `playChainSound()`  [EXTRACTED]
  game.js → game.js  _Bridges community 10 → community 8_
- `ghostY()` --calls--> `collide()`  [EXTRACTED]
  game.js → game.js  _Bridges community 3 → community 4_
- `clearLines()` --calls--> `updateHUD()`  [EXTRACTED]
  game.js → game.js  _Bridges community 8 → community 3_

## Import Cycles
- None detected.

## Communities (11 total, 0 thin omitted)

### Community 0 - "game.js"
Cohesion: 0.08
Nodes (21): canvas, COLORS, ctx, EFFECT_RENDERERS, levelEl, LINE_SCORES, linesEl, MINI_PIECE (+13 more)

### Community 1 - "Tetris"
Cohesion: 0.12
Nodes (16): 1. `index.html`, 2. `style.css`, 3. `game.js`, Controles, Cómo ejecutar el juego, Cómo funciona, Estructura del proyecto, Flujo del juego (+8 more)

### Community 2 - "CLAUDE.md"
Cohesion: 0.33
Nodes (4): Architecture, graphify, Project, Running

### Community 3 - "loop"
Cohesion: 0.15
Nodes (18): collide(), createBoard(), endGame(), init(), isTSpin(), lockCenter(), lockPiece(), loop() (+10 more)

### Community 4 - "lockPiece"
Cohesion: 0.22
Nodes (9): draw(), drawBlock(), drawFreezeOverlay(), drawGrid(), drawNext(), ghostY(), hardDrop(), renderEffects() (+1 more)

### Community 5 - "collide"
Cohesion: 0.40
Nodes (5): fillCell(), renderBolt(), renderBomb(), renderTintFire(), strokeCellRect()

### Community 6 - "spawn"
Cohesion: 0.40
Nodes (4): Claude Tetris, Language, Power-Ups, Scoring Chains

### Community 7 - "Cómo funciona"
Cohesion: 0.50
Nodes (4): applyTheme(), cssVar(), initTheme(), toggleTheme()

### Community 8 - "grantPowerUp"
Cohesion: 0.24
Nodes (13): addChainEffect(), addEffect(), clearCell(), clearLines(), detonateTint(), doBolt(), doBomb(), doFreeze() (+5 more)

### Community 9 - "applyMute"
Cohesion: 0.67
Nodes (3): applyMute(), initMute(), toggleMute()

### Community 10 - "playChainSound"
Cohesion: 0.67
Nodes (3): ensureAudio(), playChainSound(), playTone()

## Knowledge Gaps
- **41 isolated node(s):** `COLORS`, `PIECES`, `PENTOMINO_PIECES`, `MINI_PIECE`, `LINE_SCORES` (+36 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `COLORS`, `PIECES`, `PENTOMINO_PIECES` to the rest of the system?**
  _41 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `game.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Tetris` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._