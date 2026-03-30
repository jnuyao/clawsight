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
    ┌──────────▼──────────────────────────────────┐
    │           Scene Skill Ecosystem              │
    │                                              │
    │  career-mirror  — Career direction analysis  │
    │  tech-compass   — Technology roadmap         │
    │  writing-voice  — Authentic voice writing    │
    │  learning-path  — Personalized learning      │
    │  stakeholder-briefer — Quick context briefs  │
    └──────────────────────────────────────────────┘
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
GitHub profile               ├─ Identity               tech-compass
LinkedIn export              ├─ Technical Skills        writing-voice
Personal website             ├─ Career Summary          learning-path
JSON Resume                  └─ Education               stakeholder-briefer
                             
                             MEMORY.md
                             ├─ Career Trajectory
                             ├─ Technical Landscape
                             ├─ Known Projects
                             ├─ Cross-Source Insights
                             ├─ Cross-Source Notes
                             └─ Profile Evolution Log
                             
                             memory/projects/*.md
```

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
