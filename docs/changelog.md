# Changelog

All notable changes to Clawsight.

## [0.5.0] — 2026-03-30

### Added — Layer 3: Potential Discovery
- **`/clawsight potential` command**: Industry trend search × compound advantage mapping × opportunity gap analysis
- **Dialogue-Based Profile Enrichment (Step 8)**: Passive detection of new user info during normal conversation, non-intrusive update suggestions
- **Profile Evolution Tracking**: Records skill shifts, activity changes, and growth patterns across refreshes
- **career-mirror Scene Skill**: Independent SKILL.md for career direction analysis, published to ClawHub (`skills/career-mirror/`)
- Rich Mode (with Clawsight profile) and Lite Mode (without)

### Changed
- Step 7b expanded with structured 4-part potential analysis process
- Modularized SKILL.md: detailed templates, schemas, and scoring moved to `docs/` for size optimization
- SKILL.md reduced from 25,827B → 18,205B (29% smaller) while adding v0.4+v0.5 features

## [0.4.0] — 2026-03-30

### Added — Layer 2: Insight Deepening
- **LinkedIn Recommendations Parser** (`source_linkedin_zip`): Parse `recommendations.json` from LinkedIn export for third-party endorsements
- **`/clawsight refresh` command**: Re-fetch all previously imported sources, diff against stored data, staleness check (>90 days)
- **5 Structured Insight Types**: Hidden Strengths, Behavioral-Declarative Gaps, Blind Spots, Compound Advantages, Evolution Signals
- **Behavioral Pattern Analysis** in `source_github`: Coding schedule (morning/night/consistent), consistency score, collaboration ratio
- `docs/schema.md` — Full canonical extraction schema (extracted from SKILL.md)
- `docs/scoring.md` — Detailed scoring methodology
- `docs/templates.md` — Output templates for USER.md, MEMORY.md, preview, reports

## [0.3.0] — 2026-03-30

### Added — Multi-Source Intelligence Engine
- **SKILL.md v0.3**: Complete rewrite as Pure Skill (no TypeScript runtime needed)
- **7-Step Pipeline**: Identify → Fetch → Parse → Cross-Source Reconciliation → Validate → Preview → Write
- **Step 3.5 Cross-Source Reconciliation**: 5-type conflict detection, source-domain trust matrix, contradictions-as-insights
- **Three-Layer Intelligence**: Profile (画像构建) → Insight (当下洞察) → Potential (潜力发掘)
- **GitHub Deep Parser**: 4 endpoints (profile, repos, README, events)
- Brand: Mantis Shrimp 🦐 — "See what you can't see about yourself"
- `docs/architecture.md`, `docs/user-journey.md`
- `examples/sample-output/` — USER.md and MEMORY.md samples
- `examples/prompts/` — career-mirror and tech-compass prompt templates

### Changed
- TypeScript CLI archived to `legacy/` (still functional for reference)
- Repo renamed from `claw-life-import` to `clawsight`
- README.md rewritten for Pure Skill focus

## [0.2.0] — 2026-03-28

### Added
- Full SKILL.md with 6-step pipeline
- Two-layer architecture: Import Engine + Memory Sync Engine
- Evidence & provenance tracking system
- 7 source parsers (website, GitHub, JSON Resume, LinkedIn export/URL, PDF, plain text)
- Privacy filter with L0-L3 classification
- Dual scoring: Profile Coverage + Assistant Understanding
- Preview-first confirmation flow

## [0.1.0] — 2026-03-25

### Added
- Initial TypeScript CLI (`claw-life-import`)
- Basic resume import pipeline
- PDF, JSON, and text parser support
- USER.md and MEMORY.md writer
