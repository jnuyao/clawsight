# claw-life-import

> Import your personal data to bootstrap Claw's memory — fast.

[![Version](https://img.shields.io/badge/version-0.1.1-blue)](#)
[![License](https://img.shields.io/badge/license-MIT-green)](#)
[![OpenClaw Skill](https://img.shields.io/badge/OpenClaw-Skill-purple)](#)
[![Tests](https://img.shields.io/badge/tests-45%20passed-brightgreen)](#)

## The Problem

New OpenClaw users face a **"cold start" problem** — Claw knows nothing about you.
Building memory through conversation costs ~**$30-50** in tokens and takes dozens of
back-and-forth exchanges.

## The Solution

**claw-life-import** lets you skip that by importing data you already have:

```bash
# 5 minutes to go from stranger to well-known
/import-resume ./my-resume.pdf
# → 23 fields imported, Memory Score: 0 → 67 ✅
```

## Quick Start

### Installation

```bash
# Install from ClawHub
clawhub install claw-life-import

# Or clone and build from source
git clone https://github.com/jnuyao/claw-life-import.git
cd claw-life-import
npm install
npm run build
```

### Usage

```bash
# Import a resume (PDF)
/import-resume ./resume.pdf

# Import a resume (JSON Resume standard)
/import-resume ./resume.json

# Import from GitHub profile
/import-resume https://github.com/username

# Import from a personal website (SPA-aware)
/import-resume https://yaohom.vercel.app/

# Import plain text (e.g., copied from SPA site)
/import-resume ./resume.txt

# SPA workaround: provide pre-rendered content
/import-resume --content "$(cat resume.txt)" --source-url https://example.com

# Preview without writing (dry-run)
/import-resume ./resume.pdf --dry-run

# Check your Memory Score
/memory-score
```

### CLI Mode (standalone)

```bash
# Run directly with Node.js
node dist/index.js import-resume ./resume.pdf
node dist/index.js memory-score
```

## Supported Formats

### v0.1.1 (Current)

| Format | Command | Status |
|--------|---------|--------|
| PDF Resume | `/import-resume ./file.pdf` | ✅ Supported |
| JSON Resume | `/import-resume ./file.json` | ✅ Supported |
| LinkedIn JSON | `/import-resume ./linkedin-export.json` | ✅ Supported |
| GitHub Profile | `/import-resume https://github.com/user` | ✅ Supported |
| Personal Website | `/import-resume https://example.com` | ✅ SPA-aware |
| Plain Text | `/import-resume ./resume.txt` | ✅ Supported |

### Planned

| Format | Command | Version |
|--------|---------|---------|
| Browser Bookmarks | `/import-bookmarks` | v0.3 |
| Notes (Notion/Obsidian) | `/import-notes` | v0.4 |
| AI Chat History | `/import-ai-history` | v0.5 |
| Calendar (ICS) | `/import-calendar` | v1.0 |
| Photo EXIF | `/import-photos` | v1.0 |

## Memory Score

Memory Score (0-100) measures how well Claw knows you across 7 categories:

```
🧠 Memory Score

████████████████░░░░ 67/100

身份信息 Identity         ████████░░ 80%
技能图谱 Skills           ███████░░░ 70%
兴趣爱好 Interests        ██░░░░░░░░ 20%
工作风格 Work Style       █░░░░░░░░░ 10%
项目经历 Projects         ████████░░ 80%
人际关系 Relationships    █░░░░░░░░░ 10%
生活方式 Lifestyle        ░░░░░░░░░░  0%

💡 已有基本了解！试试导入浏览器书签让我更懂你的兴趣 → /import-bookmarks
```

## Privacy

Privacy is the **#1 priority**, aligned with OpenClaw's "Security and safe defaults" principle.

### 4-Level Classification

| Level | Name | Behavior | Examples |
|-------|------|----------|----------|
| L0 | Public | Auto-write | Job title, skills, project names |
| L1 | General | Write, can cancel | Company name, school, city |
| L2 | Sensitive | Skip, opt-in only | Email, phone, salary |
| L3 | Extreme | Always discard | ID numbers, passwords, bank cards |

### Guarantees

- **100% local processing** — no data leaves your machine
- **No external API calls for data** — only LLM calls for extraction
- **Transparent audit log** — every import generates a detailed report
- **User control** — every field can be reviewed before writing
- **L3 auto-detection** — regex patterns catch sensitive data even if LLM misses it

## Architecture

```
┌──────────────────────────────────────────────────┐
│                claw-life-import                    │
│                                                    │
│  ┌──────────┐  ┌──────────┐  ┌─────────────────┐ │
│  │  INGEST   │→│ EXTRACT   │→│ WRITE + VERIFY   │ │
│  │           │  │           │  │                  │ │
│  │ Format    │  │ LLM JSON  │  │ Privacy Filter  │ │
│  │ Detection │  │ Extraction│  │ Confidence Gate │ │
│  │ PDF Parse │  │ Schema    │  │ Memory Writer   │ │
│  │ JSON Map  │  │ Validate  │  │ Score Update    │ │
│  │ URL Fetch │  │ Semantics │  │ User Confirm    │ │
│  │ SPA-aware │  │ Scoring   │  │ Progress UI     │ │
│  └──────────┘  └──────────┘  └─────────────────┘ │
│                                                    │
│  Memory Plugin Interface (Memsearch / Mem0 / ...)  │
└──────────────────────────────────────────────────┘
```

## Project Structure

```
claw-life-import/
├── SKILL.md                     # OpenClaw Skill metadata
├── package.json
├── tsconfig.json
├── jest.config.js               # Test configuration
├── src/
│   ├── index.ts                 # Entry point + CLI
│   ├── schemas/
│   │   ├── canonical-resume.ts  # Unified resume schema
│   │   └── privacy-levels.ts   # Privacy classification rules
│   ├── parsers/
│   │   ├── format-detector.ts   # Auto-detect input format
│   │   ├── pdf-resume-parser.ts # PDF extraction
│   │   ├── json-resume-parser.ts# JSON Resume / LinkedIn
│   │   └── url-resume-parser.ts # GitHub / website (SPA-aware)
│   ├── extractors/
│   │   └── llm-extractor.ts    # LLM structured extraction
│   ├── validators/
│   │   ├── schema-validator.ts  # Layer 1: structure
│   │   ├── semantic-validator.ts# Layer 2: reasonableness
│   │   └── confidence-scorer.ts # Layer 3: confidence
│   ├── privacy/
│   │   └── classifier.ts       # L0-L3 classification
│   ├── writers/
│   │   └── memory-writer.ts    # Write to USER.md etc.
│   ├── scoring/
│   │   └── memory-score.ts     # Memory Score engine
│   ├── commands/
│   │   ├── import-resume.ts    # /import-resume
│   │   └── memory-score.ts     # /memory-score
│   └── utils/
│       ├── date-utils.ts       # Date normalization
│       └── text-utils.ts       # Text cleaning + sections
├── tests/
│   ├── fixtures/
│   │   └── yaohom-resume-text.txt  # Real-world test data
│   ├── helpers/
│   │   └── mock-llm-provider.ts    # Mock LLM for testing
│   ├── unit/
│   │   ├── llm-extractor.test.ts
│   │   ├── url-parser.test.ts
│   │   ├── validators.test.ts
│   │   └── privacy-classifier.test.ts
│   └── integration/
│       └── full-pipeline.test.ts
└── README.md
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key (for LLM extraction) | — |
| `ANTHROPIC_API_KEY` | Anthropic API key (alternative) | — |
| `LLM_BASE_URL` | Custom LLM endpoint | `https://api.openai.com/v1` |
| `LLM_MODEL` | Model to use for extraction | `gpt-4o-mini` |
| `GITHUB_TOKEN` | GitHub token (for higher API rate limits) | — |

> When running inside OpenClaw, the agent's own model is used automatically.

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests with verbose output
npx jest --runInBand --verbose

# Development mode (auto-rebuild)
npm run dev
```

## Changelog

### v0.1.1 — Hardening with Real-World Data

Tested against a real personal site resume ([yaohom.vercel.app](https://yaohom.vercel.app/)) and fixed all issues discovered:

**Bug Fixes**
- **SPA Detection**: URL parser now detects JavaScript-rendered sites (React/Vue/Next.js) that return empty HTML shells via `fetch()`. Shows clear guidance for workaround.
- **LLM Extractor Format**: Fixed hardcoded `source_format: 'pdf'` — now correctly passes the actual source format through.
- **Array Filtering**: LLM extraction now filters out `null`/`undefined`/empty values from arrays (highlights, technologies, skills).

**New Features**
- **Pre-rendered Content**: New `--content` flag and `preRenderedContent` option for SPA sites.
- **Progress Callbacks**: `onProgress` callback for real-time UI feedback during import pipeline.
- **Improved HTML→Text**: Structural HTML-to-text conversion preserving headings, lists, and links (vs. naive tag stripping).

**Testing**
- 45 tests across 5 test suites (all passing)
- Real-world integration test with yaohom.vercel.app fixture data
- Unit tests for: URL parser, LLM extractor, validators, privacy classifier
- Mock LLM provider infrastructure for deterministic testing

### v0.1.0 — Initial MVP

Full resume import pipeline: PDF, JSON Resume, LinkedIn JSON, GitHub profiles, personal websites.
3-layer validation, 4-level privacy, Memory Score engine.

## Roadmap

| Version | Content | ETA |
|---------|---------|-----|
| ~~v0.1~~ | Resume import (PDF/JSON/URL) + Memory Score | ✅ Done |
| **v0.1.1** ← current | Real-world hardening + tests + SPA support | ✅ Done |
| v0.2 | Interactive confirmation flow + guided onboarding | +3-5 days |
| v0.3 | Browser bookmark import (Chrome/Firefox) | +1 week |
| v0.4 | Notes import (Notion/Obsidian) | +1-2 weeks |
| v0.5 | AI history migration (ChatGPT/Claude export) | +1 week |
| v1.0 | Calendar + photos + full privacy UI + ClawHub publish | +2-3 weeks |

## License

MIT
