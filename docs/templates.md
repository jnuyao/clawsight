# Clawsight Output Templates

Version: 0.5

---

## Privacy Preview Template

```
🦐 Clawsight Import Preview

Source: {source} ({source_type})
Format: {format} | Confidence: {confidence}
Cross-Source Status: {N} sources analyzed | {M} insights discovered

📋 Will Write (L0 + L1):
┌──────────────────────────────────────────┐
│ Name: {name}                             │
│ Headline: {headline}                     │
│ Experience: {N} positions ({range})      │
│ Education: {school} ({years})            │
│ Skills: {N} technical, {N} domain        │
│ Projects: {N} projects                   │
└──────────────────────────────────────────┘

⚡ Cross-Source Conflicts (need your input):
  {List any unresolved factual conflicts from Step 3.5d}

🔮 Cross-Source Insights:
  {Preview of insights from Step 3.5f}

🔓 Semi-public (L2a) — reply "允许公开资料" to include:
  • GitHub: {url}
  • Website: {url}

🔒 Sensitive (L2b):
  (none found)

👉 Reply:
  • "确认" / "confirm" — write L0+L1 to memory
  • "允许公开资料" / "allow public" — also include L2a
  • "全部" / "all" — include L0+L1+L2a+L2b
  • "取消" / "cancel" — abort
```

---

## USER.md Template

Write or update these **fixed sections only**. If USER.md exists, preserve all other content.

```markdown
# Identity

- **Name**: {name}
- **Headline**: {headline}
- **Location**: {location}

# Technical Skills

## Primary
{Skills confirmed by 2+ sources or appearing in 2+ experience entries}
{Each skill annotated: "Go [confidence: high] [source: github+resume]"}

## Secondary
{Remaining skills with source tags}

# Career Summary

{years_of_experience} years in {primary domains}.

## Career Timeline
{Reverse-chronological, each entry:}
- **{company}** · {team} — {title} ({start} - {end or Present})
  {description, 1-2 lines}

# Education

- **{institution}** — {degree} in {field} ({start} - {end})
  {achievements}

---
*Profile built by Clawsight on {YYYY-MM-DD}*
*Sources: {list of source types and URLs}*
*Overall confidence: {score}*
```

**Merge rules:**
- Known sections: `# Identity`, `# Technical Skills`, `# Career Summary`, `# Education`. Update within.
- Unknown sections: **DO NOT TOUCH**.
- Always update the footer.

---

## MEMORY.md Template

Before writing, check for existing `[source: ...]` tags. Same source → replace. Different source → append.

```markdown
## Career Trajectory [source: {source} {date}] [confidence: {level}]

### {company} · {title}
- {highlight with metrics}
  > Evidence: "{original text}" — {source_url}

Technologies: {tech list}

## Technical Landscape [source: {source} {date}] [confidence: {level}]

{Skills grouped by domain, each with source attribution}

## Known Projects [source: {source} {date}] [confidence: {level}]

- **{name}** ({role}): {description} [{technologies}]
  > Evidence: "{text}" — {source}

## Cross-Source Insights [updated: {date}]
> These observations emerge from patterns across your data sources.

{Numbered insights from Step 3.5f}

## Cross-Source Notes [updated: {date}]
> Auto-resolved reconciliation decisions for transparency.

{List of auto-resolved conflicts and the resolution applied}

## Profile Evolution Log [updated: {date}]
> Tracks changes detected across refreshes.

- {date}: {change description}
  e.g., "技术栈从 Java 主导 → Go 主导（过去 6 个月）"
  e.g., "新增 3 个 Rust 项目（上次刷新时为 0）"
```

---

## memory/projects/{slug}.md Template

Stable slug naming: lowercase, hyphens, no special chars.

```markdown
# {Project Name}

- **Role**: {role}
- **Technologies**: {technologies}
- **URL**: {url}
- **Stars**: {stars, if GitHub}

## Description
{description}

## Key Achievements
{highlights}

---
*Sources: {list} | Updated: {YYYY-MM-DD} | Confidence: {level}*
```

If file exists (same slug), **update** content.

---

## Import Report Template

```
📊 Clawsight Import Report

Source: {source_type} — {source_url}
New source added: ✅  (Total sources: {N})

Profile Coverage (this source):  ██████████████████░░ 87/100

Assistant Understanding:         ████████████████░░░░ 78/100
Before: {X} → After: {Y} (+{delta})

  Identity        ████████░░ 80%
  Career & Skills ████████░░ 78%
  Projects        ██████░░░░ 60%
  Interests       █░░░░░░░░░ 10%
  Work Style      ███░░░░░░░ 30%
  Relationships   ░░░░░░░░░░  0%

⚡ Cross-Source Insights Generated: {N}
  1. {First insight headline}
  2. {Second insight headline}
  ...

💡 Recommendations:
  • {Next suggested source to add for maximum insight gain}
  • {Specific low-scoring area and how to improve it}
```

---

## Refresh Report Template

```
🔄 Clawsight Refresh Report

Sources refreshed: {N}
Date: {YYYY-MM-DD}

| Source | Last Import | Status | Changes |
|--------|-------------|--------|---------|
| GitHub (@user) | 2025-01-15 | ✅ Updated | +5 repos, language shift |
| Resume (resume.pdf) | 2024-10-01 | ⚠️ Stale (>90 days) | No new data available |

## Evolution Detected:
- 技术栈从 Java 主导 → Go 主导（过去 6 个月）
- 新增 3 个 Rust 项目（上次刷新时为 0）
- 开源贡献频率从 monthly → weekly

## New Insights from Changes:
{Any new cross-source insights triggered by the diff}
```

---

## Insight Report Template

```markdown
# 🦐 Clawsight Insight Report

Generated: {date}
Sources analyzed: {list}

## Hidden Strengths
{Strengths visible only through cross-source analysis — NOT present in any single source}

## Behavioral-Declarative Gaps
{Where what you DO differs from what you SAY}
- e.g., "简历强调管理能力，但 GitHub 活动显示你仍然是最活跃的代码贡献者"

## Blind Spots
{Important aspects missing from your self-presentation}
- e.g., "3 位 LinkedIn 推荐人提到你的 mentoring，但你的简历完全没有提及"

## Compound Advantages
{Unique combinations of skills/experience that are rare in the market}
- e.g., "支付系统 × 分布式架构 × 全球化经验 — 这个组合在市场上 < 0.1% 的人具备"

## Evolution Signals
{Trajectory and momentum analysis}
- e.g., "Go contributions increased 3x in 6 months — strong upward trajectory"
- e.g., "Shifting from IC to tech lead: 4 collaborative PRs in Q4 vs 0 in Q1"
```

---

## Potential Vectors Report Template

```markdown
# 🦐 Clawsight Potential Vectors

Generated: {date}
Based on: {N} sources, {M} compound advantages

> These are observations and possibilities, NOT predictions.
> They highlight directions worth exploring based on your unique profile.

## Industry Trend Context
{Brief summary of current trends relevant to user's domain, fetched via web search}

## Potential Vectors

### 1. {Opportunity Name}
- **Your advantage**: {specific skill combination from Compound Advantages}
- **Market signal**: {relevant industry trend}
- **Opportunity gap**: {high-demand skill adjacent to current expertise}
- **Confidence**: {high | medium | low}
- **Why this matters**: {1-2 sentence explanation}

### 2. ...

## Adjacent Skills Worth Exploring
{Skills that are 1 step away from current expertise and in high demand}

---
*Framed as observations. Your career decisions are yours alone.*
```
