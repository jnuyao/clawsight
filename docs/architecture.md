# Clawsight Technical Architecture

> Internal reference for contributors and Scene Skill developers.

## System Overview

Clawsight is an **OpenClaw Pure Skill** — it runs entirely through SKILL.md instructions interpreted by the AI agent. No external runtime, no dependencies, no compiled code.

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│  /clawsight <source>  │  /clawsight insight/potential   │
│  /clawsight refresh   │  /clawsight score               │
└──────────────┬────────────────────────┬─────────────────┘
               │                        │
    ┌──────────▼──────────┐  ┌──────────▼──────────┐
    │   Import Pipeline   │  │  Intelligence Layer  │
    │   Steps 1-6         │  │  Steps 7-8           │
    │                     │  │                      │
    │  1. Identify Source  │  │  7a. Insight Report  │
    │  2. Fetch            │  │  7b. Potential Disc. │
    │  3. Parse & Norm.    │  │  8. Dialogue Enrich. │
    │  3.5. Reconciliation │  │                      │
    │  4. Validate         │  └──────────┬───────────┘
    │  5. Privacy Preview  │             │
    │  6. Write & Report   │             │
    └──────────┬───────────┘             │
               │                         │
    ┌──────────▼─────────────────────────▼──────────┐
    │              Memory Layer (Files)               │
    │                                                 │
    │  USER.md          — Identity & career summary   │
    │  MEMORY.md        — Detailed evidence & insights│
    │  memory/projects/ — Per-project deep files      │
    └──────────┬─────────────────────────────────────┘
               │
    ┌──────────▼──────────────────────────────────────────────┐
    │              Scene Skill Ecosystem                       │
    │                                                          │
    │  ┌──────────────────────────────────────────────────┐   │
    │  │        Career Intelligence Chain (v0.6)           │   │
    │  │                                                    │   │
    │  │  career-mirror ──→ tech-spectrum ──→ tech-compass  │   │
    │  │  (内省: 我在哪)    (定位: AI时代     (行动: 下一步   │   │
    │  │                     我处于什么位置)    做什么)        │   │
    │  └──────────────────────────────────────────────────┘   │
    │                                                          │
    │  Planned:                                                │
    │  writing-voice  — Authentic voice writing                │
    │  learning-path  — Personalized learning                  │
    │  stakeholder-briefer — Quick context briefs              │
    └──────────────────────────────────────────────────────────┘
```

## Pipeline Detail

### Import Pipeline (Steps 1-6)

Responsible for fetching external data, parsing, reconciling across sources, and writing to memory.

**Step 3.5: Cross-Source Reconciliation** is the core differentiator:

```
Source A (Resume)  ──┐
                     ├──→ Fact Alignment ──→ Conflict Detection ──→ Resolution
Source B (GitHub)  ──┤        │                    │
                     │    Map equivalent       5 types:
Source C (LinkedIn)──┘    facts across        factual, temporal,
                          sources             emphasis, omission,
                                              granularity
                                                   │
                                          ┌────────┴────────┐
                                          │                 │
                                     Auto-resolve     Escalate to user
                                     (4 of 5 types)   (factual only)
                                          │
                                    Record decisions
                                    in Cross-Source Notes
```

**Trust Hierarchy:**
```
Behavioral (what you DO)     — weight 0.9  — GitHub commits, patterns
Third-party (what OTHERS say)— weight 0.8  — LinkedIn recommendations, endorsements
Declarative (what you SAY)   — weight 0.7  — Resume, LinkedIn, website
Inferred (what we DEDUCE)    — weight 0.5  — Cross-referencing patterns
```

### Intelligence Layer (Steps 7-8)

**Step 7a — Insight Report** generates 5 insight types:
1. Hidden Strengths — visible only through cross-source analysis
2. Behavioral-Declarative Gaps — what you DO vs what you SAY
3. Blind Spots — missing from self-presentation but evidenced elsewhere
4. Compound Advantages — rare skill/domain combinations
5. Evolution Signals — trajectory momentum and direction changes

**Step 7b — Potential Discovery** maps advantages against trends:
1. Search industry trends for user's domains
2. Map compound advantages against market demand
3. Identify opportunity gaps (high-demand skills adjacent to expertise)
4. Generate Potential Vectors report

**Step 8 — Dialogue Enrichment** (passive, v0.5):
- Detects new user info in normal conversations
- Non-intrusive: suggests updates only after current task completes
- Lightweight: updates only relevant sections

### Refresh Pipeline (`/clawsight refresh`, v0.4)

```
Enumerate stored sources (from [source:] tags)
    │
    ├── Staleness check (>90 days → flag)
    │
    ├── Re-fetch each source
    │
    ├── Diff against stored data
    │
    ├── Profile evolution tracking
    │   └── Record changes: tech shifts, new projects, activity changes
    │
    └── Update with confirmation
```

## Data Flow: Source → Memory → Scene Skill

```
External Sources              Memory Files              Scene Skills
─────────────────    ──→     ──────────────    ──→     ────────────
Resume (PDF/text)            USER.md                   career-mirror
GitHub profile               ├─ Identity               tech-spectrum
LinkedIn export              ├─ Technical Skills        tech-compass
Personal website             ├─ Career Summary          ───────────
JSON Resume                  └─ Education               writing-voice (planned)
                                                        learning-path (planned)
                             MEMORY.md                  stakeholder-briefer (planned)
                             ├─ Career Trajectory
                             ├─ Technical Landscape
                             ├─ Known Projects
                             ├─ Cross-Source Insights
                             ├─ Cross-Source Notes
                             └─ Profile Evolution Log
                             
                             memory/projects/*.md
```

## Career Intelligence Chain (v0.6)

The three career-focused Scene Skills form a directed chain with structured data passing:

```
┌──────────────┐     ┌───────────────┐     ┌──────────────┐
│career-mirror │────→│ tech-spectrum  │────→│ tech-compass │
│              │     │               │     │              │
│ Introspection│     │ AI Positioning│     │ Action Plan  │
│              │     │               │     │              │
│ • Career Arc │     │ • AI Spectrum │     │ • Skill      │
│ • Compound   │     │   Position    │     │   Quadrant   │
│   Advantages │     │ • AI Exposure │     │ • AI Skill   │
│ • Behavioral │     │   Analysis    │     │   Layers     │
│   Truth      │     │ • Trend ×     │     │ • Learning   │
│ • Blind Spot │     │   Profile     │     │   Routes     │
│   Map        │     │   Intersection│     │ • 30-60-90   │
└──────┬───────┘     └──────┬────────┘     │   Day Plan   │
       │                    │              │ • Risk &     │
       │  CAREER_MIRROR     │  TECH_       │   Adaptation │
       │  _OUTPUT           │  SPECTRUM    └──────────────┘
       │  (HTML comment     │  _OUTPUT           ▲
       │   with YAML)       │  (HTML comment     │
       └────────────────────┴────────────────────┘
```

### Cross-Skill Data Passing Protocol

Skills pass structured data via HTML comment blocks appended to reports:

```html
<!-- CAREER_MIRROR_OUTPUT
verified_advantages:
  - {skill: "distributed systems", confidence: "high", sources: 3}
blind_spots:
  - {area: "leadership narrative", evidence: "recommendations vs resume"}
career_arc_stage: "mid-senior transitioning to architect"
-->
```

Downstream skills parse these blocks for evidence-based analysis. See [scene-skills-protocol.md](scene-skills-protocol.md) for the full specification.

### Three Operating Modes

Each Scene Skill adapts to available data:

| Mode | Condition | Data Sources |
|------|-----------|-------------|
| Enhanced | Profile + upstream outputs available | career-mirror + tech-spectrum outputs |
| Rich | Clawsight profile exists (≥1 source file) | USER.md, MEMORY.md, memory/projects/* |
| Lite | No profile data | Interactive Q&A with user |

### Supporting Data Sources

| File | Used By | Content |
|------|---------|---------|
| [docs/ai-trends.md](ai-trends.md) | tech-spectrum | 130+ milestones across 8 AI tracks |
| [docs/skill-layers.md](skill-layers.md) | tech-compass | L0-L4 AI Skill Layers framework |
| [docs/scene-skills-protocol.md](scene-skills-protocol.md) | All Scene Skills | Interaction rules and data passing format |

### MCP Enhancement Path

| Phase | Capability | Impact |
|-------|-----------|--------|
| Phase 1 (current) | Pure Skill — LLM knowledge only | Qualitative analysis, no real-time data |
| Phase 2 | MCP tools — web search, job APIs | Real-time trend validation, market data |
| Phase 3 | Data layer — structured trend DB | Quantitative scoring, historical tracking |

## Scene Skill Protocol

Scene Skills consume Clawsight profile data. Design principles:

1. **Graceful degradation**: Works without profile (Lite Mode), better with it (Rich Mode)
2. **Read-only**: Scene Skills read USER.md/MEMORY.md but never write to them
3. **Independent**: Each Scene Skill is a standalone SKILL.md, installable separately
4. **Cross-referral**: Each Scene Skill recommends installing Clawsight for deeper analysis
5. **Feedback loop**: If a Scene Skill discovers missing profile dimensions, it suggests the user update via Clawsight

## File Size Budget

| File | Target | Purpose |
|------|--------|---------|
| SKILL.md | < 19KB | Core pipeline (OpenClaw limit) |
| docs/schema.md | ~4KB | Canonical extraction schema |
| docs/scoring.md | ~3KB | Scoring methodology |
| docs/templates.md | ~8KB | Output templates |
| Scene Skill SKILL.md | < 6KB each | Focused, single-purpose |
