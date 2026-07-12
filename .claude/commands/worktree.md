---
description: Create isolated git worktree and execute instructions inside it
---

Requirement from user: $ARGUMENTS

Steps, in order:

1. Derive a short kebab-case name (2-4 words) summarizing the requirement above. This is `[nombre]`.
2. Run: `git worktree add .trees/[nombre]` from repo root. If `.trees/` doesn't exist, `git worktree add` creates it. If branch `[nombre]` already exists, use `git worktree add .trees/[nombre] [nombre]`; if worktree path already exists, append a numeric suffix.
3. `cd` into `.trees/[nombre]` for all subsequent work — every file read/edit/write and command execution for this task must happen inside that worktree directory, never in the main working tree.
4. Execute the requirement's instructions fully inside the worktree, isolated from main.
5. Report back: worktree path, branch name, and summary of changes made.

Do not touch files outside `.trees/[nombre]` while carrying out the requirement.
