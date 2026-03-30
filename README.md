# 🦐 Clawsight

**See what you can't see about yourself.**

> Named after the **Mantis Shrimp** (螳螂虾) — the creature with 16 types of color receptors that perceives dimensions invisible to all other animals. Clawsight does the same for your professional identity.

Clawsight is an [OpenClaw](https://github.com/nicepkg/openclaw) **Pure Skill** that builds a multi-source AI profile with cross-referenced insights. One command to go from stranger to deeply understood.

## The Problem

New AI agent users face a **cold start problem** — the agent knows nothing about you. Building memory through conversation costs ~$30-50 in tokens and 30+ minutes of effort. Worse: you probably can't objectively articulate your own strengths, blind spots, and hidden potential.

## The Solution

```
/clawsight https://github.com/yourname
/clawsight ./my-resume.pdf
/clawsight insight
```

Clawsight imports your data from multiple sources, cross-correlates them, and generates insights you can't see yourself:

| Layer | What It Does | Example |
|-------|-------------|---------|
| **Profile** 画像构建 | Multi-source data import + normalization | Resume + GitHub → unified profile |
| **Insight** 当下洞察 | Cross-source contradiction analysis | "简历说 Java，GitHub 90% Go → 转型信号" |
| **Potential** 潜力发掘 | Compound advantages × industry trends | "支付×分布式×全球化 = 稀缺组合" |

## How It Works

Clawsight runs a **7-step pipeline** entirely through SKILL.md instructions — no CLI, no npm, no external runtime:

```
Step 1: Identify Sources → What data do we have?
Step 2: Fetch           → Retrieve raw content
Step 3: Parse           → Extract structured fields
Step 3.5: Reconcile ★   → Cross-source conflict detection & resolution
Step 4: Validate        → Schema + semantic checks
Step 5: Preview         → Privacy filter + user confirmation
Step 6: Write           → Update USER.md + MEMORY.md
Step 7: Insight         → Generate cross-source insights (on-demand)
```

**Step 3.5** is the core differentiator — it detects 5 types of cross-source conflicts (factual, temporal, emphasis, omission, granularity), resolves them using a source-domain trust matrix, and turns contradictions into insights.

## Supported Sources

| Source | Method | What We Extract |
|--------|--------|----------------|
| **Resume (PDF/TXT)** | Direct parse | Career narrative, skills, education |
| **GitHub Profile** | API fetch | Actual tech stack, contribution patterns, projects |
| **Personal Website** | Smart crawl (5-level fallback) | Self-presentation, projects, blog topics |
| **JSON Resume** | Standard parse | Structured profile data |
| **LinkedIn Export** | JSON import | Network, endorsements, recommendations |
| **Plain Text** | Direct parse | Any profile-like text |

## Output

Clawsight writes to OpenClaw's standard memory files:

- **`USER.md`** — Structured profile with source-tagged confidence levels
- **`MEMORY.md`** — Detailed career trajectory, skills landscape, cross-source insights
- **`memory/projects/*.md`** — Individual project files

### Cross-Source Insights (the magic)

When 2+ sources are imported, Clawsight generates insights that no single source reveals:

```markdown
## Cross-Source Insights
1. **技术栈转型信号**: 简历定位 Java，GitHub 主力已转向 Go
2. **隐藏的领导力**: LinkedIn 推荐信 3 次提到 mentoring，简历未体现
3. **复合优势**: 支付系统 × 分布式架构 × 全球化经验 — 稀缺组合
```

## Quick Start

### Install from ClawHub

```bash
clawhub install clawsight
```

### Import Your First Source

```bash
# Start with your resume
/clawsight ./resume.pdf

# Add GitHub for behavioral data
/clawsight https://github.com/yourname

# See what emerges from the cross-reference
/clawsight insight
```

### Check Your Profile Score

```bash
/clawsight score
```

## Brand

**Spirit Animal**: Mantis Shrimp (螳螂虾)
- 16 types of color receptors (humans have 3)
- Sees UV, infrared, and polarized light
- Crustacean family — shares the "claw" connection with OpenClaw
- Metaphor: sees hidden dimensions in your professional identity

**Tagline**: *See what you can't see about yourself.*

**Pairing with Hindsight**: *Hindsight remembers your past. Clawsight sees your future.*

## Architecture

Clawsight is a **Pure Skill** — the entire product is a single `SKILL.md` file interpreted by the OpenClaw AI agent. No TypeScript, no npm dependencies, no external runtime.

```
clawsight/
├── SKILL.md              ← The product (v0.3, ~25KB)
├── README.md             ← You are here
├── LICENSE
├── docs/
│   ├── architecture.md   ← Technical deep-dive
│   ├── user-journey.md   ← Full interaction lifecycle
│   └── changelog.md      ← Version history
├── examples/
│   ├── sample-output/    ← Example USER.md and MEMORY.md
│   └── prompts/          ← Scene skill prompt templates
└── legacy/               ← Archived TypeScript CLI (v0.1.x)
```

See [docs/architecture.md](docs/architecture.md) for the technical deep-dive.

## Competitive Landscape

| Project | What It Does | Clawsight Difference |
|---------|-------------|---------------------|
| Mem0 (48K★) | Continuous memory layer | Day 1+ memory. We solve Day 0 cold start + insights |
| Hindsight (5.9K★) | Conversation → memory sync | Records what happens. We import what already exists |
| Letta (21K★) | Stateful agent framework | Infrastructure layer. We're the application layer |
| Zep (24K★) | Session memory for chatbots | Enterprise memory. We're personal profile intelligence |

**Clawsight occupies a unique quadrant**: Lightweight × Active Import × Insight Generation.

## Roadmap

| Phase | Timeline | Focus |
|-------|----------|-------|
| **0.3** | 4 weeks | Multi-source engine + ClawHub launch |
| **0.4** | 4 weeks | Insight deepening + community feedback |
| **0.5** | 4 weeks | Potential discovery + scene skills |
| **1.0** | 8 weeks | OpenClaw profile standard proposal |

## Contributing

Clawsight is open source under MIT. Contributions welcome:

- **Test it**: Install, import your data, report what works and what doesn't
- **Source parsers**: Help improve extraction for specific website formats
- **Scene skills**: Build domain-specific skills that consume Clawsight profiles
- **Insight patterns**: Suggest new cross-source insight detection rules

## License

MIT
