# Graph Report - claude-tetris  (2026-07-11)

## Corpus Check
- 4 files · ~2,584 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 59 nodes · 85 edges · 8 communities
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0ca1b79d`
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

## God Nodes (most connected - your core abstractions)
1. `Tetris` - 10 edges
2. `lockPiece()` - 7 edges
3. `spawn()` - 7 edges
4. `collide()` - 6 edges
5. `loop()` - 6 edges
6. `init()` - 6 edges
7. `draw()` - 5 edges
8. `Cómo funciona` - 5 edges
9. `ghostY()` - 4 edges
10. `softDrop()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `init()` --indirect_call--> `loop()`  [INFERRED]
  game.js → game.js  _Bridges community 3 → community 6_
- `loop()` --calls--> `collide()`  [EXTRACTED]
  game.js → game.js  _Bridges community 5 → community 3_
- `softDrop()` --calls--> `collide()`  [EXTRACTED]
  game.js → game.js  _Bridges community 5 → community 4_
- `spawn()` --calls--> `collide()`  [EXTRACTED]
  game.js → game.js  _Bridges community 5 → community 6_
- `lockPiece()` --calls--> `spawn()`  [EXTRACTED]
  game.js → game.js  _Bridges community 4 → community 6_

## Import Cycles
- None detected.

## Communities (8 total, 0 thin omitted)

### Community 0 - "game.js"
Cohesion: 0.13
Nodes (14): canvas, COLORS, ctx, levelEl, LINE_SCORES, linesEl, nextCanvas, nextCtx (+6 more)

### Community 1 - "Tetris"
Cohesion: 0.17
Nodes (11): Controles, Cómo ejecutar el juego, Estructura del proyecto, Licencia, Opción 1: abrir el archivo directamente, Opción 2: servidor local (recomendado), Personalización, Qué hace el proyecto (+3 more)

### Community 2 - "CLAUDE.md"
Cohesion: 0.33
Nodes (4): Architecture, graphify, Project, Running

### Community 3 - "loop"
Cohesion: 0.33
Nodes (6): draw(), drawBlock(), drawGrid(), drawNext(), loop(), togglePause()

### Community 4 - "lockPiece"
Cohesion: 0.50
Nodes (5): clearLines(), lockPiece(), merge(), softDrop(), updateHUD()

### Community 5 - "collide"
Cohesion: 0.40
Nodes (5): collide(), ghostY(), hardDrop(), rotateCW(), tryRotate()

### Community 6 - "spawn"
Cohesion: 0.50
Nodes (5): createBoard(), endGame(), init(), randomPiece(), spawn()

### Community 7 - "Cómo funciona"
Cohesion: 0.40
Nodes (5): 1. `index.html`, 2. `style.css`, 3. `game.js`, Cómo funciona, Flujo del juego

## Knowledge Gaps
- **31 isolated node(s):** `COLORS`, `PIECES`, `LINE_SCORES`, `canvas`, `ctx` (+26 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Tetris` connect `Tetris` to `Cómo funciona`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `Cómo funciona` connect `Cómo funciona` to `Tetris`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `COLORS`, `PIECES`, `LINE_SCORES` to the rest of the system?**
  _31 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `game.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._