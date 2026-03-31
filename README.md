<p align="center">
  <img src="assets/banner.jpg" alt="Clawsight — See what you can't see about yourself" width="100%">
</p>

<p align="center">
  <strong>Multi-source AI profile intelligence — cross-reference your data, discover your hidden strengths.</strong>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/OpenClaw-Pure_Skill-orange" alt="OpenClaw Pure Skill">
  <img src="https://img.shields.io/badge/version-0.6.0-green" alt="Version 0.6.0">
  <img src="https://img.shields.io/badge/runtime-zero_dependency-brightgreen" alt="Zero Dependency">
</p>

---

**Resume analyzers look at one source. Clawsight cross-references all of them.**

Your resume says "Java lead" but your GitHub is 90% Go. Three LinkedIn recommenders mention mentoring, but your resume never says "leadership." You have payment systems + distributed architecture + global experience — a triple combination that's extremely rare. These insights are invisible from any single source. They only emerge when you look across data streams.

Named after the **Mantis Shrimp** (螳螂虾) — the creature with 16 types of color receptors that sees dimensions invisible to all other animals. Clawsight does the same for your professional identity.

## Quick Start

```bash
# Install (one-time)
/install clawsight

# Import sources
/clawsight resume.pdf
/clawsight https://github.com/yourusername

# Discover insights (needs 2+ sources)
/clawsight insight

# Map your future potential
/clawsight potential
```

## Demo Output

After importing a resume + GitHub profile, `/clawsight insight` produces:

```
╔══════════════════════════════════════════════════════════╗
║  🔍 Cross-Source Insight: Behavioral-Declarative Gap     ║
╠══════════════════════════════════════════════════════════╣
║  Resume: "Backend Engineer, Java"                        ║
║  GitHub: 47 repos, 92% Go, contributor to 3 CNCF projects║
║                                                          ║
║  → Your identity has shifted to Go/cloud-native, but     ║
║    your resume still tells a Java story.                 ║
║    This gap may cost you roles you're already qualified  ║
║    for.                                                  ║
╚══════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════╗
║  💎 Compound Advantage (rare combination)                ║
╠══════════════════════════════════════════════════════════╣
║  Payment Systems × Distributed Arch × Global Ops         ║
║  Market rarity: top 2% of senior engineers               ║
║                                                          ║
║  → This triple stack is in extreme demand for fintech    ║
║    companies expanding internationally.                  ║
╚══════════════════════════════════════════════════════════╝
```

## What It Does

Clawsight operates through three intelligence layers:

| Layer | Command | What You Get |
|-------|---------|-------------|
| **Profile** | `/clawsight <source>` | Multi-source import with cross-correlation |
| **Insight** | `/clawsight insight` | Hidden strengths, blind spots, behavioral-declarative gaps |
| **Potential** | `/clawsight potential` | Compound advantages × industry trends mapping |

### Supported Sources

| Source | Command | What It Captures |
|--------|---------|-----------------|
| Resume (PDF/text) | `/clawsight resume.pdf` | Career narrative, skills, achievements |
| GitHub | `/clawsight https://github.com/user` | Real tech stack, contribution patterns, projects |
| LinkedIn export | `/clawsight linkedin.zip` | Endorsements, recommendations, network signals |
| Personal website | `/clawsight https://yoursite.com` | Self-presentation, projects, writing |
| JSON Resume | `/clawsight resume.json` | Structured profile data |

> **LinkedIn Note**: Automated access is blocked by LinkedIn. Export your data via **Settings → Get a copy of your data** — Clawsight will parse the ZIP. See [docs/linkedin-guide.md](docs/linkedin-guide.md) for step-by-step instructions.

### Additional Commands

| Command | Description |
|---------|-------------|
| `/clawsight score` | Profile completeness and understanding level |
| `/clawsight refresh` | Re-fetch all sources, detect changes over time |

## How It Works

```
 ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
 │ Resume  │  │ GitHub  │  │LinkedIn │  │ Website │
 └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘
      │            │            │             │
      └──────────┬─┴────────────┴─────────────┘
                 ▼
       ┌─────────────────────┐
       │  Parse & Normalize  │
       └─────────┬───────────┘
                 ▼
       ┌─────────────────────┐
       │  Cross-Source        │  ★ Core differentiator
       │  Reconciliation      │  Classifies 5 conflict types,
       │  Engine              │  resolves 4 automatically,
       └─────────┬───────────┘  turns contradictions → insights
                 ▼
       ┌─────────────────────┐
       │  ⛔ Privacy Preview  │  User confirms before any write
       └─────────┬───────────┘
                 ▼
    ┌────────────┼────────────┐
    ▼            ▼            ▼
┌────────┐ ┌──────────┐ ┌───────────┐
│USER.md │ │MEMORY.md │ │projects/* │
└────────┘ └──────────┘ └───────────┘
                 │
    ┌────────────┼─────────────────┐
    ▼            ▼                 ▼
┌─────────┐ ┌───────────┐ ┌──────────────┐
│ Insight │ │ Potential │ │ Scene Skills │
│ Engine  │ │ Discovery │ │  Ecosystem   │
└─────────┘ └───────────┘ └──────────────┘
```

See [docs/architecture.md](docs/architecture.md) for the full technical deep dive.

## Scene Skills — Career Intelligence Chain

Clawsight generates profile data. **Scene Skills** consume it for specialized analysis. The **Career Intelligence Chain** is a three-skill pipeline that turns self-knowledge into action:

```
career-mirror (内省)  →  tech-spectrum (定位)  →  tech-compass (行动)
   "Where am I?"          "Where do I stand        "What do I do
                           in the AI era?"           next?"
```

| Skill | Command | What It Does | Status |
|-------|---------|-------------|--------|
| [career-mirror](skills/career-mirror/) | `/career-mirror` | Career introspection with triple-source advantage verification | ✅ v2.0 |
| [tech-spectrum](skills/tech-spectrum/) | `/tech-spectrum` | AI disruption positioning — five-level spectrum from AI-vulnerable to AI-shaping | ✅ v1.0 |
| [tech-compass](skills/tech-compass/) | `/tech-compass` | Action planning with Skill Quadrant Matrix and 30-60-90 day plans | ✅ v1.0 |

### Three Operating Modes

Each Scene Skill adapts to available data:

| Mode | Condition | Experience |
|------|-----------|------------|
| **Enhanced** | Profile + upstream skill outputs | Full chain analysis with cross-validated data |
| **Rich** | Clawsight profile available | Profile-driven analysis |
| **Lite** | No profile data | Interactive Q&A, still useful |

### Cross-Skill Data Flow

Skills pass structured data via hidden HTML comment blocks at the end of reports:

```
career-mirror output  →  <!-- CAREER_MIRROR_OUTPUT ... -->
tech-spectrum output  →  <!-- TECH_SPECTRUM_OUTPUT ... -->
                              ↓
                         tech-compass reads both
```

See [docs/scene-skills-protocol.md](docs/scene-skills-protocol.md) for the full protocol specification.

<details>
<summary>Planned Scene Skills</summary>

- **writing-voice** — Write content in your authentic voice
- **learning-path** — Personalized learning plan from skill gaps
- **stakeholder-briefer** — Quick context briefs for new collaborators

</details>

## Documentation

| Doc | Content |
|-----|---------|
| [Architecture](docs/architecture.md) | System design, pipeline, data flow |
| [Scene Skills Protocol](docs/scene-skills-protocol.md) | Cross-skill interaction rules and data passing |
| [AI Trends](docs/ai-trends.md) | 8-track AI development timeline (130+ milestones) |
| [Skill Layers](docs/skill-layers.md) | AI Skill Layers L0-L4 framework |
| [Schema](docs/schema.md) | Canonical extraction schema |
| [Scoring](docs/scoring.md) | Profile completeness scoring |
| [Templates](docs/templates.md) | Output templates |
| [User Journey](docs/user-journey.md) | Interaction lifecycle |
| [LinkedIn Guide](docs/linkedin-guide.md) | LinkedIn data export steps |
| [Changelog](docs/changelog.md) | Version history |

## Roadmap

- [x] **v0.3** — Multi-source engine + Pure Skill rewrite
- [x] **v0.4** — Insight deepening + LinkedIn recommendations + refresh
- [x] **v0.5** — Potential discovery + dialogue enrichment + career-mirror
- [x] **v0.6** — Career Intelligence Chain (career-mirror v2 + tech-spectrum + tech-compass)
- [ ] **v1.0** — OpenClaw profile standard + MCP Phase 2 + Hindsight integration

## Contributing

Contributions are welcome! Here's how you can help:

1. **Build a Scene Skill** — Create a new skill under `skills/` that consumes Clawsight's profile data for specialized analysis. See [career-mirror](skills/career-mirror/) as a reference and [scene-skills-protocol.md](docs/scene-skills-protocol.md) for the protocol spec.
2. **Add a data source parser** — Propose a new source type (e.g., Stack Overflow, Dribbble) by opening an issue.
3. **Improve cross-source heuristics** — The reconciliation rules in SKILL.md can always be sharpened with real-world edge cases.
4. **Contribute to AI Trends** — Help maintain [docs/ai-trends.md](docs/ai-trends.md) with new milestones and updated assessments.
5. **Fix bugs & docs** — Typos, unclear instructions, broken examples — all PRs welcome.

```bash
# Fork → Clone → Create branch
git checkout -b feature/my-scene-skill

# Make changes, then
git push origin feature/my-scene-skill
# Open a PR
```

## License

[MIT](LICENSE) — use it, modify it, ship it.
