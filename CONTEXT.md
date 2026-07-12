# Claude Tetris

Classic falling-block puzzle game. This context covers the game's board, pieces, and scoring rules.

## Language

**Piece**:
A falling arrangement of colored cells, defined by a fixed shape matrix, that the player moves and rotates until it locks onto the Board.
_Avoid_: Tetromino, block group

**Ring Piece**:
A 3x3 Piece whose center cell is empty — an eight-cell ring with no fill in the middle. The empty center is not part of the Piece; it is simply the absence of a filled cell, identical in kind to any other unfilled cell.
_Avoid_: Nut piece, tuerca, washer piece, donut piece

**Board Cell**:
A single position in the Board grid, either empty (no value) or holding the color of a locked Piece. A Piece's own empty cells (e.g. the Ring Piece's center) do not write anything to the Board on Lock — they leave whatever was already there, which is empty for a Lock in open space.
_Avoid_: Hole, gap, block

**Lock**:
The event where a falling Piece's filled cells are written into the Board and a new Piece spawns. Only filled Piece cells participate; empty Piece cells (including the Ring Piece's center) are never written.
_Avoid_: Merge, place, drop (drop refers to movement, not the fixing event)
