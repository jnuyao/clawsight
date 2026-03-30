# Changelog

## v0.3.0 (2026-03-30) — "Mantis Shrimp"

**Major rewrite. Product renamed from claw-life-import to Clawsight.**

### Breaking Changes
- Product renamed: `claw_life_import` → `clawsight`
- Repository renamed: `claw-life-import` → `clawsight`
- Architecture: TypeScript CLI → Pure Skill (SKILL.md only)
- Pipeline: 6 steps → 7 steps (added Step 3.5: Cross-Source Reconciliation)

### New Features
- **Multi-source support**: Import from Resume + GitHub + Website + more
- **Cross-Source Reconciliation (Step 3.5)**: 5-type conflict detection, source-domain trust matrix, confidence decay model
- **Contradictions as Insights**: Cross-source conflicts generate hidden pattern insights
- **Three-Layer Intelligence**: Profile → Insight → Potential Discovery
- **GitHub profile parser**: Repos, events, language stats, contribution patterns
- **Enhanced scoring**: Dual scoring (Profile Coverage + Assistant Understanding)
- **Source-tagged memory**: Every fact tagged with source, date, confidence

### Architecture
- Pure Skill: entire product is SKILL.md (~25KB), no external dependencies
- TypeScript CLI archived to `legacy/` directory
- New docs/ and examples/ directories

### Branding
- Spirit animal: Mantis Shrimp (螳螂虾) — 16 color receptors
- Tagline: "See what you can't see about yourself."
- Emoji: 🦐

## v0.2.0 (2026-03-28) — "Smart Parser"

- Full SKILL.md rewrite with 6-step pipeline
- 5-level website fallback chain
- Privacy classification (L0-L3)
- Evidence & provenance tagging
- Dual scoring system
- Section-based USER.md merge (preserve user content)
- Source-tagged MEMORY.md sections

## v0.1.1 (2026-03-26)

- TypeScript CLI with resume import
- PDF, JSON Resume, URL, plain text parsers
- Basic memory writing

## v0.1.0 (2026-03-25) — Initial Release

- Basic resume import concept
- Single-source (resume only)
- Simple memory writing
