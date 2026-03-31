# Changelog

All notable changes to Clawsight.

## [0.6.0] — 2026-03-31

### Added — Career Intelligence Chain
- **career-mirror v2.0**: Rewritten to focus on pure introspection. New Advantage Verification Matrix with triple-source cross-validation (Declared × Behavioral × Third-party). 4 report sections: Career Arc, Compound Advantage Analysis, Behavioral Truth, Blind Spot Map. Strict scope boundary — observation only, no direction prescriptions.
- **tech-spectrum v1.0**: AI disruption positioning skill. Five-level AI Spectrum (AI-vulnerable → AI-adjacent → AI-augmented → AI-native → AI-shaping). Three-layer analysis: AI Exposure → AI Readiness → Trend Intersection. References `docs/ai-trends.md` for 8-track trend data.
- **tech-compass v1.0**: Action planning endpoint of the career chain. Skill Quadrant Matrix (Your-Level × Market-Demand), AI Skill Layer Assessment (L0-L4), personalized Learning Routes, 30-60-90 Day Action Plan with success criteria, Risk & Adaptation with disruption timeline.
- **Cross-skill data passing protocol**: HTML comment blocks with YAML (`<!-- CAREER_MIRROR_OUTPUT ... -->`, `<!-- TECH_SPECTRUM_OUTPUT ... -->`) for structured data flow between skills.
- **Three operating modes**: Enhanced (profile + upstream outputs), Rich (profile only), Lite (no profile).
- `docs/scene-skills-protocol.md` — Cross-skill interaction rules, data flow, invocation patterns
- `docs/skill-layers.md` — AI Skill Layers L0-L4 framework with criteria, evidence signals, and career phase recommendations
- `docs/ai-trends.md` — Comprehensive AI development timeline: 130+ milestones across 8 tracks (Agent & Toolchain, AI-Native Dev, Vertical AI, Multimodal, Safety & Governance, Infrastructure, Data Engineering, Hardware/Edge)
- README.md for each new Scene Skill (`skills/tech-spectrum/README.md`, `skills/tech-compass/README.md`)

### Changed
- career-mirror narrowed from career direction analysis to pure introspection (direction suggestions moved to tech-compass)
- architecture.md updated with Career Intelligence Chain diagram, cross-skill data flow, MCP Enhancement Path, and trust hierarchy fix (added Third-party 0.8 weight)
- README.md updated with Scene Skills section, three operating modes, cross-skill data flow, and new documentation links
- `examples/prompts/tech-compass.md` updated to redirect to full Scene Skill implementation

### Architecture
- Defined MCP Enhancement Path: Phase 1 (Pure Skill) → Phase 2 (MCP tools for real-time data) → Phase 3 (structured data layer)
- Scene Skill size budget: < 6KB per SKILL.md, with methodology docs extracted to `docs/`

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
