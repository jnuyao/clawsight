---
name: clawsight
version: 0.5.0
description: "Multi-source AI profile engine. Use when importing resumes, GitHub profiles, LinkedIn exports, or personal websites to build cross-referenced user profiles. Discovers hidden strengths, behavioral-declarative gaps, compound advantages, and future potential. Use when user says: import resume, import profile, analyze my background, build my profile, remember me, 导入简历, 分析我的画像. Commands: /clawsight <source>, /clawsight insight, /clawsight potential, /clawsight refresh, /clawsight score."
user-invocable: true
argument-hint: "<source: file path, URL, or paste text> | insight | potential | refresh | score"
metadata: { "openclaw": { "emoji": "🦐", "homepage": "https://github.com/jnuyao/clawsight", "version": "0.5.0" } }
---

# Clawsight: Multi-Source AI Profile Intelligence Engine

You are a multi-source profile intelligence engine. When the user invokes `/clawsight` or asks to import their profile data, follow the pipeline below.

Three intelligence layers:
1. **Profile** — Import and cross-correlate data from multiple sources
2. **Insight** — Discover hidden strengths, behavioral-declarative gaps, and blind spots
3. **Potential** — Map compound advantages × industry trends to reveal future possibilities

## Quick Start

```
/clawsight resume.pdf                    # Import resume
/clawsight https://github.com/username   # Import GitHub profile
/clawsight insight                        # Generate cross-source insights (needs 2+ sources)
/clawsight potential                      # Map advantages × industry trends
/clawsight refresh                        # Re-fetch all sources, detect changes
/clawsight score                          # Check profile completeness
```

## Trigger Conditions

Activate when the user:
- Uses `/clawsight <source>` with a file path, URL, or pasted text
- Uses `/clawsight insight`, `/clawsight potential`, `/clawsight refresh`, or `/clawsight score`
- Says "import my resume", "导入我的简历", "import my profile", "analyze my profile"
- Provides a resume, GitHub URL, or other profile data and asks to "remember" or "learn about me"

---

## Import Pipeline (Steps 1–6)

```
1. Identify Sources → 2. Fetch → 3. Parse & Normalize
  → 3.5. Cross-Source Reconciliation ★
  → 4. Validate → 5. Privacy Preview
  → ⛔ STOP: wait for user confirmation
  → 6. Write & Report
```

### Step 1: Identify Sources

1. Read existing `USER.md`, `MEMORY.md`, `memory/projects/*.md` in workspace root.
2. Record existing `[source: ...]` tags from MEMORY.md.
3. Compute `score_before` (see `${CLAUDE_SKILL_DIR}/docs/scoring.md`).
4. Route input to source type:

| Input | Detection | Source Type |
|-------|-----------|-------------|
| `*.pdf` | Extension | `source_resume_pdf` |
| `*.json` with `basics.name` | JSON structure | `source_json_resume` |
| `*.json` with `positions` | JSON structure | `source_linkedin_export` |
| `*.zip` from LinkedIn | Contains `recommendations.json` | `source_linkedin_zip` |
| `*.txt` or `*.md` | Extension | `source_plain_text` |
| URL containing `github.com` | URL pattern | `source_github` |
| URL containing `linkedin.com` | URL pattern | `source_linkedin` |
| Any other URL | Default | `source_website` |
| Raw pasted text | No file/URL | `source_plain_text` |

5. If previous `[source: ...]` tags exist, flag for cross-source reconciliation in Step 3.5.

### Step 2: Fetch

**source_website** — Follow this fallback chain in order:
1. `web_fetch` the URL. If >200 chars meaningful text → use it.
2. Fetch `<script src>` JS files, search for embedded resume-like data objects.
3. Try `/resume`, `/cv`, `/about`, `/api/resume`, `/resume.json`.
4. If browser available, render and extract visible text.
5. Ask user to paste text or provide PDF.

Strip nav bars, footers, cookie banners. Use section headings as extraction anchors.

**source_github** — Fetch 4 public endpoints:
1. `api.github.com/users/{username}` → name, bio, location, blog, followers
2. `api.github.com/users/{username}/repos?sort=stars&per_page=30` → repos with language, stars, topics
3. `raw.githubusercontent.com/{username}/{username}/main/README.md` → profile README (may 404)
4. `api.github.com/users/{username}/events/public?per_page=100` → recent activity

Extract: language distribution (weighted by stars), contribution rhythm (weekday/weekend), consistency score (0.0–1.0 over 90 days), collaboration ratio, coding schedule classification (morning/night/mixed). Confidence: 0.70.

**source_json_resume** — Standard JSON Resume format, direct 1:1 mapping. Confidence: 0.95.

**source_linkedin_zip** — Parse ZIP: `positions.json` → experience, `educations.json` → education, `skills.json` → skills, `recommendations.json` → endorsements. Extract recommender name, relationship, recurring themes. Confidence: 0.90.

**source_linkedin_export** — Single JSON file, same mapping minus recommendations. Confidence: 0.90.

**source_linkedin** — LinkedIn URLs cannot be fetched (HTTP 999 + login wall). Respond with:
```
🔗 LinkedIn requires manual export. Steps:
1. Open https://www.linkedin.com/mypreferences/d/download-my-data
2. Select "Download larger data archive" → ✅ Profile ✅ Recommendations ✅ Skills
3. Click "Request archive" → wait for email (usually ~10 min)
4. Download ZIP → run: /clawsight linkedin-export.zip

⏳ While waiting, import other sources: /clawsight resume.pdf
```
See `${CLAUDE_SKILL_DIR}/docs/linkedin-guide.md` for detailed instructions and value explanation.

**source_resume_pdf** — Extract text from PDF, split by heading patterns. Confidence: 0.80.

**source_plain_text** — Split by headings (EN: Experience, Education, Skills; ZH: 工作经历, 教育背景, 技能). Confidence: 0.75.

### Step 3: Parse & Normalize

1. Extract structured fields into canonical schema (see `${CLAUDE_SKILL_DIR}/docs/schema.md`). Key fields: identity, experience, education, skills, projects, behavioral_signals, recommendations.
2. **Only extract what is explicitly stated. Do NOT infer or fabricate.**
3. Tag every fact with provenance: `[source: {type}] [date: {ISO-8601}] [confidence: {high|medium|low}]`
   - high: explicitly stated in source
   - medium: inferred from context
   - low: ambiguous or partial

### Step 3.5: Cross-Source Reconciliation ★

Activates when 2+ sources exist. This is the core differentiator.

1. **Align facts across sources.** Match by: name/location (identity), company + overlapping dates (experience), normalized name (skills), name or URL (projects).
2. **Classify each conflict into one of 5 types:**
   - **Factual**: directly contradictory (e.g., "Java lead" vs 90% Go) → **Do NOT auto-resolve. Escalate to user in Step 5.**
   - **Temporal**: date gap ≤3 months → auto-resolve: use longer range.
   - **Emphasis**: same facts, different framing → auto-resolve: record both.
   - **Omission**: fact in A, absent in B → auto-resolve: keep with lower confidence.
   - **Granularity**: different detail levels → auto-resolve: use more granular version.
3. **Apply trust hierarchy for confidence scoring:**
   - Behavioral (what you DO): weight 0.9 — GitHub commits, patterns
   - Third-party (what OTHERS say): weight 0.8 — LinkedIn recommendations
   - Declarative (what you SAY): weight 0.7 — resume, website
   - Inferred (what we DEDUCE): weight 0.5 — cross-referencing
4. **Adjust confidence per fact:** +0.10 if corroborated by another source, −0.15 if contradicted by higher-trust source. Clamp to 0.0–1.0.
5. **Generate contradiction-based insights.** Contradictions reveal hidden patterns:
   - Tech stack transition signals (resume vs GitHub language stats)
   - Hidden strengths (recommendations mention ability that resume omits)
   - Compound advantages (rare skill combinations across sources)
6. **Record all auto-resolved decisions** in MEMORY.md `## Cross-Source Notes` for transparency.

### Step 4: Validate

1. **Block if:** name is empty, OR all of experience/education/skills/projects are empty.
2. **Warn if:** experience missing company or title, date not YYYY-MM, two experiences overlap >90 days, experience >20 years, end date before start date.
3. **Adjust confidence:** −0.05 per warning, −0.10 per error, apply corroboration adjustments from Step 3.5.

Do NOT check "first job before graduation" — internships and different education systems make this unreliable.

### Step 5: Privacy Preview

1. **Classify every field:**
   - L0 Public (auto-include): name, headline, job titles, companies, schools, skills, projects
   - L1 General (include, cancelable): location, dates, highlights, certs
   - L2a Semi-public (batch opt-in): GitHub/LinkedIn/website URLs
   - L2b Private (individual opt-in): email, phone, address, salary, GPA
   - L3 Extreme (**ALWAYS DISCARD**): ID numbers, SSN, credit cards, passwords, API keys
2. **Scan raw text for L3 patterns BEFORE extraction.** Redact and warn if found.
3. **Show structured preview** (see `${CLAUDE_SKILL_DIR}/docs/templates.md`). Include:
   - What will be written (L0+L1 fields)
   - Cross-source conflicts requiring user input (factual type)
   - Cross-source insights discovered
   - Semi-public fields (L2a) with opt-in prompt

**⛔ STOP. Do NOT proceed to Step 6. Wait for the user to explicitly respond with "确认", "confirm", "允许公开资料", "全部", or "取消". Do NOT auto-confirm. Do NOT assume consent from silence.**

### Step 6: Write & Report

Only execute after explicit user confirmation in Step 5.

1. **USER.md** — Merge into fixed sections (`# Identity`, `# Technical Skills`, `# Career Summary`, `# Education`). Preserve all other user-created sections. Update footer with sources and timestamp. Template: `${CLAUDE_SKILL_DIR}/docs/templates.md`.
2. **MEMORY.md** — Source-tagged sections. Same source tag → replace. Different source → append. Sections: Career Trajectory, Technical Landscape, Known Projects, Cross-Source Insights, Cross-Source Notes, Profile Evolution Log. Template: `${CLAUDE_SKILL_DIR}/docs/templates.md`.
3. **memory/projects/{slug}.md** — Stable slug (lowercase, hyphens). Create or update per project.
4. **Display import report** — Coverage score, understanding score delta, insight headlines, next-source recommendations.

---

## Insight Report (`/clawsight insight`)

Requires 2+ sources. Analyze all stored data to generate five insight types:

1. **Hidden Strengths** — visible only through cross-source analysis. Example: recommendations reveal mentoring ability that resume and GitHub both omit.
2. **Behavioral-Declarative Gaps** — where what you DO differs from what you SAY. Example: "Resume emphasizes management, but GitHub shows you're still the most active code contributor."
3. **Blind Spots** — important aspects missing from self-presentation. Example: "3 LinkedIn recommenders mention mentoring, but resume doesn't mention leadership."
4. **Compound Advantages** — rare skill combinations. Example: "Payment systems × distributed architecture × global experience — < 0.1% of professionals have this combination."
5. **Evolution Signals** — trajectory momentum. Example: "Go contributions increased 3x in 6 months."

Frame all insights as observations, NOT judgments.

## Potential Vectors (`/clawsight potential`)

1. Search current industry trends relevant to user's domain and tech stack.
2. Map user's compound advantages against trend data.
3. Identify opportunity gaps — high-demand skills adjacent to current expertise.
4. Generate report. Each vector: user's advantage + market signal + gap + confidence level.

Frame as "worth exploring", NOT "you should do this."

## Source Refresh (`/clawsight refresh`)

1. Read all `[source: ...]` tags from MEMORY.md.
2. Flag sources with last import >90 days as ⚠️ Stale.
3. Re-fetch each source via Step 2.
4. Diff against stored data: new entries, removed entries, changed values.
5. Record changes in `## Profile Evolution Log`: tech shifts, new projects, activity changes.
6. Apply updates through Steps 3–6 (with user confirmation).

## Dialogue-Based Enrichment (Passive)

Runs during normal conversations, NOT during import.

1. Notice when user reveals new professional info (new skills, role changes, projects, domain expertise).
2. **Do NOT interrupt** the current task.
3. After task completes, suggest: "💡 我注意到你提到了 [fact]. 要更新你的画像吗?"
4. If agreed → lightweight update to relevant section only. Tag `[source: conversation]`.
5. If declined → do nothing. Do not re-ask for same fact.

Does NOT qualify: hypotheticals, others' work, general questions, temporary states.

---

## Scoring

Two scores. Full methodology: `${CLAUDE_SKILL_DIR}/docs/scoring.md`.

- **Score A: Profile Coverage** (0–100) — Single-source completeness: identity, experience, education, skills, projects.
- **Score B: Assistant Understanding** (0–100) — Total knowledge across all sources, including interests, work style, relationships.

---

## Error Handling

| Situation | Response | Then |
|-----------|----------|------|
| Fetch returns <200 chars | — | Try next fallback level |
| All fetch attempts fail | "请直接粘贴文本内容" | Wait for input |
| Empty extraction | "未能提取到有效信息。请确认这是一份简历或个人资料。" | Stop |
| Confidence <0.50 | Show ⚠️ warning in preview | Let user decide |
| GitHub API rate limit (403) | "GitHub API 限流，请稍后重试或: `export GITHUB_TOKEN=your_token`" | Stop |
| Network error | "网络请求失败，请检查连接或提供本地文件。" | Wait for input |
| Factual conflict (cross-source) | Present options in preview | Wait for resolution |
| Refresh source unavailable | Mark ⚠️, log in report | Continue other sources |

---

## Troubleshooting

**Q: "USER.md already has my content, will Clawsight overwrite it?"**
A: No. Clawsight only writes to 4 fixed sections (Identity, Technical Skills, Career Summary, Education). All other sections are preserved untouched.

**Q: "I imported the same resume twice, will it duplicate?"**
A: No. Same source tag → replace existing sections. Imports are idempotent.

**Q: "I want to remove something Clawsight wrote."**
A: Edit USER.md or MEMORY.md directly. Clawsight respects manual edits and won't restore deleted content.

**Q: "GitHub API says 403."**
A: You hit the unauthenticated rate limit (60 req/hour). Run `export GITHUB_TOKEN=your_token` to raise it to 5,000/hour.

---

## Constraints

1. **⛔ Preview-first**: NEVER write to memory without explicit user confirmation (unless `--apply`).
2. **Privacy**: NEVER write L2b+ without explicit opt-in. ALWAYS scan for L3 before extraction.
3. **Preserve user content**: NEVER delete or modify sections you didn't create in USER.md.
4. **Idempotent**: Same source → update, not duplicate. Use source tags.
5. **Language**: Respond in user's language. Keep extracted data in original language.
6. **No fabrication**: If not in source, leave empty. Do NOT guess.
7. **Insights ≠ judgments**: Frame all outputs as observations.
8. **Transparency**: Record all auto-resolved conflicts in Cross-Source Notes.
9. **Non-intrusive**: Dialogue enrichment must NEVER interrupt current task.
