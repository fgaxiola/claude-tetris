# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Classic Tetris implemented in vanilla JavaScript (ES6+), HTML5 Canvas, and CSS. No dependencies, no build step, no `package.json`, no test suite — just static files.

## Running

No install/build required. Either open directly or serve statically:

```bash
open index.html            # macOS, opens directly
python3 -m http.server 8000  # or any static server
```

There is no lint or test command in this repo.

## Architecture

Three files, all logic lives in `game.js` (~300 lines):

- `index.html` — DOM shell: main `<canvas id="board">` (300×600, i.e. `COLS × BLOCK` by `ROWS × BLOCK`), a side panel (score/lines/level, next-piece preview canvas, controls list), and pause/game-over overlays.
- `style.css` — dark/retro arcade visual theme only.
- `game.js` — all game logic:
  - **Board model**: `ROWS × COLS` matrix, each cell `0` (empty) or a color index (1–7) identifying a locked piece.
  - **Pieces**: square matrices; rotation via transpose + row-reverse (`rotateCW`).
  - **Collision** (`collide`): checks board bounds and overlap with locked cells.
  - **Wall kicks** (`tryRotate`): on rotation collision, tries ±1/±2 column offsets before giving up.
  - **Game loop** (`loop`): `requestAnimationFrame`-driven, accumulates delta time, drops the piece one row past `dropInterval`.
  - **Line clearing** (`clearLines`): bottom-to-top scan; full rows removed, empty rows unshifted at top.
  - **Scoring**: classic table `[0, 100, 300, 500, 800]` × current level; hard drop = 2 pts/cell, soft drop = 1 pt/row.
  - **Level/speed**: level increases every 10 lines; `dropInterval = max(100, 1000 - (level-1)*90)` ms.
  - **Ghost piece** (`ghostY`): projects current piece straight down, drawn at `globalAlpha = 0.2`.

Flow: `init()` → `createBoard()` → seed `next` piece → `spawn()` (promotes `next` to current, generates new `next`) → `requestAnimationFrame(loop)`. `keydown` drives move/rotate/soft-drop/hard-drop/pause. If a freshly spawned piece immediately collides, `endGame()` fires and the Game Over overlay shows.

Tunable constants at the top of `game.js`: `COLS`, `ROWS`, `BLOCK`, `COLORS`, `LINE_SCORES`, `dropInterval`. Changing `COLS`/`ROWS`/`BLOCK` requires updating the `<canvas id="board">` `width`/`height` in `index.html` to match.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
