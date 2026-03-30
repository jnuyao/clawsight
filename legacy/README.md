# Legacy: claw-life-import TypeScript CLI

> **Status**: Archived. This was the original TypeScript CLI implementation of claw-life-import (v0.1.x).
> The project has evolved into **Clawsight**, an OpenClaw Pure Skill that requires no CLI tooling.

## What's Here

- `src/` — TypeScript source (commands, extractors, parsers, validators, writers)
- `tests/` — Unit & integration tests
- `skills/claw_life_import/SKILL.md` — v0.2 skill definition (superseded by root SKILL.md v0.3)
- `package.json` / `tsconfig.json` — Node.js project configuration

## Why Archived

Clawsight v0.3+ is a **Pure Skill** — it runs entirely through SKILL.md instructions
interpreted by the OpenClaw AI agent. No external runtime, no npm dependencies,
no compiled code. The TypeScript CLI was a useful prototype but is no longer
the product direction.

## If You Need This Code

```bash
cd legacy/
npm install
npm run build
npm test
```

The code still works as a standalone CLI if needed for reference or testing.
