# Graph Report - claude-tetris  (2026-07-11)

## Corpus Check
- 5 files · ~4,295 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 80 nodes · 121 edges · 9 communities
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a7a2bc80`
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

## God Nodes (most connected - your core abstractions)
1. `Tetris` - 10 edges
2. `grantPowerUp()` - 9 edges
3. `lockPiece()` - 9 edges
4. `spawn()` - 7 edges
5. `collide()` - 6 edges
6. `loop()` - 6 edges
7. `init()` - 6 edges
8. `clearLines()` - 5 edges
9. `updateHUD()` - 5 edges
10. `draw()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `loop()` --calls--> `collide()`  [EXTRACTED]
  game.js → game.js  _Bridges community 5 → community 3_
- `softDrop()` --calls--> `collide()`  [EXTRACTED]
  game.js → game.js  _Bridges community 5 → community 4_
- `grantPowerUp()` --calls--> `doGravity()`  [EXTRACTED]
  game.js → game.js  _Bridges community 4 → community 8_
- `lockPiece()` --calls--> `spawn()`  [EXTRACTED]
  game.js → game.js  _Bridges community 4 → community 3_

## Import Cycles
- None detected.

## Communities (9 total, 0 thin omitted)

### Community 0 - "game.js"
Cohesion: 0.11
Nodes (17): canvas, COLORS, ctx, levelEl, LINE_SCORES, linesEl, nextCanvas, nextCtx (+9 more)

### Community 1 - "Tetris"
Cohesion: 0.12
Nodes (16): 1. `index.html`, 2. `style.css`, 3. `game.js`, Controles, Cómo ejecutar el juego, Cómo funciona, Estructura del proyecto, Flujo del juego (+8 more)

### Community 2 - "CLAUDE.md"
Cohesion: 0.33
Nodes (4): Architecture, graphify, Project, Running

### Community 3 - "loop"
Cohesion: 0.22
Nodes (11): createBoard(), draw(), drawBlock(), drawGrid(), drawNext(), endGame(), init(), loop() (+3 more)

### Community 4 - "lockPiece"
Cohesion: 0.29
Nodes (8): clearLines(), detonateTint(), doGravity(), lockCenter(), lockPiece(), merge(), softDrop(), updateHUD()

### Community 5 - "collide"
Cohesion: 0.40
Nodes (5): collide(), ghostY(), hardDrop(), rotateCW(), tryRotate()

### Community 6 - "spawn"
Cohesion: 0.50
Nodes (3): Claude Tetris, Language, Power-Ups

### Community 7 - "Cómo funciona"
Cohesion: 0.50
Nodes (4): applyTheme(), cssVar(), initTheme(), toggleTheme()

### Community 8 - "grantPowerUp"
Cohesion: 0.33
Nodes (7): clearCell(), doBolt(), doBomb(), doFreeze(), doTint(), grantPowerUp(), showPowerUpToast()

## Knowledge Gaps
- **36 isolated node(s):** `COLORS`, `PIECES`, `LINE_SCORES`, `POWERUP_NAMES`, `canvas` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `COLORS`, `PIECES`, `LINE_SCORES` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `game.js` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `Tetris` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._