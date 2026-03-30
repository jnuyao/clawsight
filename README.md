# Clawsight 🦐

> **See what you can't see about yourself.**

Clawsight is an OpenClaw Pure Skill that builds your AI profile from multiple data sources, cross-references them to discover hidden patterns, and maps your potential against industry trends.

Named after the **Mantis Shrimp** (螳螂虾) — the creature with 16 types of color receptors that perceives dimensions invisible to all other animals. Clawsight does the same for your professional identity.

## Quick Start

```
/install clawsight
/clawsight resume.pdf
/clawsight https://github.com/yourusername
/clawsight insight
```

## What It Does

Clawsight operates through three intelligence layers:

| Layer | Command | What You Get |
|-------|---------|-------------|
| **Profile** (画像构建) | `/clawsight <source>` | Multi-source import with cross-correlation |
| **Insight** (当下洞察) | `/clawsight insight` | Hidden strengths, blind spots, behavioral-declarative gaps |
| **Potential** (潜力发掘) | `/clawsight potential` | Compound advantages × industry trends mapping |

### Supported Sources

| Source | Command | What It Captures |
|--------|---------|-----------------|
| Resume (PDF/text) | `/clawsight resume.pdf` | Career narrative, skills, achievements |
| GitHub | `/clawsight https://github.com/user` | Real tech stack, contribution patterns, project portfolio |
| LinkedIn export | `/clawsight linkedin-export.zip` | Endorsements, recommendations, professional network signals |
| Personal website | `/clawsight https://yoursite.com` | Self-presentation, projects, writing |
| JSON Resume | `/clawsight resume.json` | Structured profile data |

### The Magic: Cross-Source Intelligence

Single-source import is thin — anyone can paste a resume and ask AI to remember it. Clawsight's value comes from **cross-referencing**:

- **Resume says Java lead, GitHub shows 90% Go** → "You may be in a tech stack transition your resume hasn't caught up with"
- **3 LinkedIn recommenders mention mentoring, resume omits leadership** → "Your influence is bigger than your self-description"
- **Payment systems × distributed architecture × global experience** → "This triple combination is extremely rare in the market"

These insights are invisible from any single source. They only emerge when you look across data streams — like the Mantis Shrimp seeing ultraviolet, infrared, and polarized light simultaneously.

## Additional Commands

| Command | Description |
|---------|-------------|
| `/clawsight score` | Check profile completeness and understanding level |
| `/clawsight refresh` | Re-fetch all sources, detect changes, track evolution |
| `/clawsight potential` | Industry trend mapping × your compound advantages |

## Scene Skills Ecosystem

Clawsight generates profile data. **Scene Skills** consume it for specialized analysis:

| Skill | Status | What It Does |
|-------|--------|-------------|
| [career-mirror](skills/career-mirror/) | ✅ Available | Career direction analysis with compound advantage mapping |
| tech-compass | 📋 Planned | Technology learning roadmap based on your stack + market trends |
| writing-voice | 📋 Planned | Write content in your authentic voice |
| learning-path | 📋 Planned | Personalized learning plan from skill gaps |
| stakeholder-briefer | 📋 Planned | Quick context briefs for new collaborators |

## How It Works

```
Sources → 7-Step Pipeline → Memory Files → Scene Skills

Step 1: Identify Sources
Step 2: Fetch (5-level fallback for websites)
Step 3: Parse & Normalize
Step 3.5: Cross-Source Reconciliation  ★ Core differentiator
Step 4: Validate
Step 5: Privacy Preview (user confirms before any write)
Step 6: Write & Report
Step 7: Insight & Potential Discovery (on-demand)
Step 8: Dialogue-Based Profile Enrichment (passive)
```

The **Cross-Source Reconciliation Engine** (Step 3.5) classifies conflicts into 5 types, applies a source-domain trust hierarchy, auto-resolves 4 of 5 types, and turns contradictions into insights.

See [docs/architecture.md](docs/architecture.md) for the full technical deep dive.

## Output Files

| File | Purpose |
|------|---------|
| `USER.md` | Identity, skills, career summary, education |
| `MEMORY.md` | Detailed evidence, cross-source insights, evolution log |
| `memory/projects/*.md` | Per-project deep files |

See [examples/sample-output/](examples/sample-output/) for what these look like.

## Documentation

| Doc | Content |
|-----|---------|
| [Architecture](docs/architecture.md) | System design, pipeline detail, data flow |
| [User Journey](docs/user-journey.md) | 7-stage interaction lifecycle |
| [Schema](docs/schema.md) | Canonical extraction schema |
| [Scoring](docs/scoring.md) | Profile Coverage + Understanding scoring |
| [Templates](docs/templates.md) | Output templates for USER.md, MEMORY.md |
| [Changelog](docs/changelog.md) | Version history |

## Brand

**Mascot**: Mantis Shrimp (螳螂虾)
- 16 color receptor types (humans have 3)
- Crustacean family (connected to Claw)
- Sees hidden dimensions others cannot

**Tagline**: "See what you can't see about yourself."

**Paired with Hindsight**: "Hindsight remembers your past. Clawsight sees your future."

## Roadmap

- [x] v0.3 — Multi-source engine + Pure Skill rewrite
- [x] v0.4 — Insight deepening + LinkedIn recommendations + refresh
- [x] v0.5 — Potential discovery + dialogue enrichment + career-mirror
- [ ] v1.0 — OpenClaw profile standard + 5 Scene Skills + Hindsight integration

## License

MIT
