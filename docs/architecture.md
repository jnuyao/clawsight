# Clawsight Technical Architecture

## Pure Skill Architecture

Clawsight is a **Pure Skill** — the entire product logic lives in `SKILL.md`, a ~25KB markdown file interpreted by the OpenClaw AI agent at runtime. There is no compiled code, no npm dependencies, no external runtime.

```
┌─────────────────────────────────────────────────┐
│                  OpenClaw Agent                  │
│  ┌───────────────────────────────────────────┐  │
│  │            SKILL.md (Clawsight)           │  │
│  │  ┌─────────┐  ┌──────────┐  ┌─────────┐  │  │
│  │  │ Step 1-3│→ │Step 3.5 ★│→ │Step 4-7 │  │  │
│  │  │  Import │  │Reconcile │  │  Write   │  │  │
│  │  └─────────┘  └──────────┘  └─────────┘  │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ USER.md  │  │MEMORY.md │  │ projects/*.md│  │
│  └──────────┘  └──────────┘  └──────────────┘  │
└─────────────────────────────────────────────────┘
         ↑               ↑              ↑
    web_fetch       file_read      file_write
    (GitHub API)    (local files)  (memory files)
```

### Why Pure Skill?

| Approach | Install | Dependencies | Maintenance | Distribution |
|----------|---------|-------------|-------------|-------------|
| CLI tool (v0.1.x) | `npm install` | Node.js, 50+ packages | Update npm, fix CVEs | npm registry |
| **Pure Skill (v0.3)** | `clawhub install` | None | Update SKILL.md | ClawHub |

The AI agent already has all capabilities needed: web fetching, file I/O, text parsing, structured reasoning. SKILL.md provides the *instructions*, not the *implementation*.

## Seven-Step Pipeline

### Step 1: Identify Sources
- Read existing USER.md / MEMORY.md for baseline
- Detect input type (URL, file, text)
- Route to appropriate source handler

### Step 2: Fetch
- 5-level fallback chain for websites (direct → JS bundle → alt pages → browser → user)
- GitHub API: 4 endpoints (profile, repos, README, events)
- PDF: text extraction via available tools
- Privacy-safe: no scraping of protected content (LinkedIn)

### Step 3: Parse & Normalize
- Extract to canonical schema (identity, experience, education, skills, projects, behavioral_signals)
- Provenance tagging: every fact carries `[source: type] [date: timestamp] [confidence: level]`

### Step 3.5: Cross-Source Reconciliation ★
This is the core innovation. See below.

### Step 4: Validate
- Schema checks (block on critical errors)
- Semantic checks (warn on anomalies)
- Confidence adjustment based on validation results

### Step 5: Privacy Preview
- 5-level privacy classification (L0 Public → L3 Extreme)
- User confirmation required before any write
- Conflict resolution UI for factual disagreements

### Step 6: Write & Report
- Section-based merge for USER.md (preserve user-written content)
- Source-tagged append for MEMORY.md (idempotent re-import)
- Stable-slug project files

### Step 7: Insight & Potential (On-Demand)
- Cross-source insight generation
- Compound advantage × industry trend mapping

## Cross-Source Reconciliation Engine (Step 3.5)

### Five Conflict Types

| Type | Auto-Resolve Rule |
|------|------------------|
| Factual | Never auto-resolve → escalate to user |
| Temporal | Gap ≤ 3 months → use longer range |
| Emphasis | Always auto → record both framings |
| Omission | Always auto → keep with lower confidence |
| Granularity | Always auto → use more detailed version |

### Source-Domain Trust Matrix

```
Trust Weight:
  Behavioral (GitHub)   = 0.9  → What you actually DO
  Declarative (Resume)  = 0.7  → What you SAY you do
  Inferred (Analysis)   = 0.5  → What we DEDUCE

Domain Specialization:
  Tech skills    → GitHub > Resume > LinkedIn
  Career story   → Resume > LinkedIn > GitHub
  Working style  → GitHub events > all others
  Soft skills    → LinkedIn recs > Resume
  Impact metrics → Resume > all others
```

### Confidence Model

```
confidence = base_weight(source_type)
           + 0.10 × corroborating_sources
           - 0.15 × contradicting_higher_trust_sources
           - 0.05 × validation_warnings

clamp(confidence, 0.0, 1.0)
```

### Contradictions as Insights

The key innovation: conflicts between sources aren't just problems — they reveal hidden patterns about the user. A gap between what someone *says* (resume) and what they *do* (GitHub) often contains the most valuable career insights.

## Three-Layer Intelligence Model

```
Layer 3: Potential (潜力发掘)
  Compound advantages × industry trends
  "Where could you go?"
         ↑
Layer 2: Insight (当下洞察)
  Cross-source contradictions → hidden patterns
  "What can't you see about yourself?"
         ↑
Layer 1: Profile (画像构建)
  Multi-source import + normalization
  "Who are you right now?"
```

Each layer builds on the one below. Layer 1 is always required. Layer 2 activates with 2+ sources. Layer 3 is on-demand.
