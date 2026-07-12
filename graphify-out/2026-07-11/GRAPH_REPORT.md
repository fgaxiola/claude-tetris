# Graph Report - claude-tetris  (2026-07-11)

## Corpus Check
- 5 files · ~5,164 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 92 nodes · 146 edges · 9 communities
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.5)
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
4. `addEffect()` - 7 edges
5. `spawn()` - 7 edges
6. `draw()` - 7 edges
7. `collide()` - 6 edges
8. `loop()` - 6 edges
9. `init()` - 6 edges
10. `clearLines()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `clearLines()` --calls--> `updateHUD()`  [EXTRACTED]
  game.js → game.js  _Bridges community 8 → community 3_
- `draw()` --calls--> `ghostY()`  [EXTRACTED]
  game.js → game.js  _Bridges community 3 → community 4_

## Import Cycles
- None detected.

## Communities (9 total, 0 thin omitted)

### Community 0 - "game.js"
Cohesion: 0.10
Nodes (18): canvas, COLORS, ctx, EFFECT_RENDERERS, levelEl, LINE_SCORES, linesEl, nextCanvas (+10 more)

### Community 1 - "Tetris"
Cohesion: 0.12
Nodes (16): 1. `index.html`, 2. `style.css`, 3. `game.js`, Controles, Cómo ejecutar el juego, Cómo funciona, Estructura del proyecto, Flujo del juego (+8 more)

### Community 2 - "CLAUDE.md"
Cohesion: 0.33
Nodes (4): Architecture, graphify, Project, Running

### Community 3 - "loop"
Cohesion: 0.16
Nodes (17): collide(), createBoard(), endGame(), ghostY(), hardDrop(), init(), lockCenter(), lockPiece() (+9 more)

### Community 4 - "lockPiece"
Cohesion: 0.29
Nodes (7): draw(), drawBlock(), drawFreezeOverlay(), drawGrid(), drawNext(), renderEffects(), renderGravity()

### Community 5 - "collide"
Cohesion: 0.40
Nodes (5): fillCell(), renderBolt(), renderBomb(), renderTintFire(), strokeCellRect()

### Community 6 - "spawn"
Cohesion: 0.50
Nodes (3): Claude Tetris, Language, Power-Ups

### Community 7 - "Cómo funciona"
Cohesion: 0.50
Nodes (4): applyTheme(), cssVar(), initTheme(), toggleTheme()

### Community 8 - "grantPowerUp"
Cohesion: 0.29
Nodes (11): addEffect(), clearCell(), clearLines(), detonateTint(), doBolt(), doBomb(), doFreeze(), doGravity() (+3 more)

## Knowledge Gaps
- **37 isolated node(s):** `COLORS`, `PIECES`, `LINE_SCORES`, `POWERUP_NAMES`, `canvas` (+32 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `COLORS`, `PIECES`, `LINE_SCORES` to the rest of the system?**
  _37 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `game.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `Tetris` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._