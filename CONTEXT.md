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

**Tetris**:
A Line Clear of exactly four rows from a single Lock.
_Avoid_: Quad, four-line clear

**Pentomino**:
One of the Pieces built from five filled cells (Plus, U, or Y), each with a 5% combined chance of being chosen in place of a classic Piece each time a new Piece is generated, split evenly among the three.
_Avoid_: Special piece, bonus shape

**Mini**:
A single-cell Piece with a distinctive gold color, granted as the immediately current Piece the moment a Tetris occurs. Mini is never generated through normal random Piece selection — it exists only as this reward. The Piece that was already queued as the next preview is not discarded; it becomes the Piece after Mini.
_Avoid_: Reward piece, bonus piece, 1x1

## Power-Ups

**PowerUp**:
A one-time random effect granted when the cumulative cleared-line count crosses a multiple of the Power-Up Threshold. At most one PowerUp is granted per Lock, even if that Lock crosses the threshold more than once. A PowerUp is chosen randomly among Bomb, Bolt, Tint, Gravity, and Freeze, and applies immediately and automatically — the player never collects or manually activates it.
_Avoid_: Power up, bonus, item, pickup

**Power-Up Threshold**:
The configurable line count (N) that must be crossed, cumulatively, to grant a PowerUp. Crossing is evaluated against the total cleared-line count, not an exact-multiple match, so a multi-line clear that jumps past a multiple still grants exactly one PowerUp.
_Avoid_: N, interval, frequency

**Bomb**:
A PowerUp that destroys a 3x3 area of Board Cells centered on the Lock that triggered it. If the 3x3 area would extend past the Board edge, its center shifts just enough to keep the full 3x3 area inside the Board.
_Avoid_: Explosion, blast

**Bolt**:
A PowerUp that clears one full row or one full column of Board Cells — chosen 50/50 at random — passing through the Lock that triggered it.
_Avoid_: Lightning, laser, beam

**Tint**:
A PowerUp that arms one color, chosen randomly among colors currently present on the Board (or is wasted if the Board is empty). Only one color can be armed at a time; arming a new color replaces whichever color was previously armed, discarding its unfired detonation. An armed color detonates the next time a normal full-row clear includes a Board Cell of that color: detonation clears every Board Cell of that color anywhere on the Board, not just the triggering row, and does not compact the resulting gaps.
_Avoid_: Wildcard, dye, color bomb

**Gravity**:
A PowerUp that compacts every column of the Board independently, dropping all non-empty Board Cells straight down to eliminate gaps beneath them while preserving their relative order within the column. If compaction leaves any row completely full, that row clears through the normal Line Clear rules (score and cumulative line count included).
_Avoid_: Compact, collapse, gap fill

**Freeze**:
A PowerUp that suspends only the automatic time-based drop for 5 seconds; the player retains full control (move, rotate, soft drop, hard drop) during that window. Triggering Freeze again while already active resets the 5-second window rather than extending or stacking it.
_Avoid_: Pause, slow, time stop
