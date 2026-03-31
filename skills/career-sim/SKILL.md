---
name: career-sim
version: 1.0.0
description: >
  Divergent career path simulator. Generates 3-5 alternative career
  trajectories based on profile data, upstream analysis, and market signals.
  Comparison matrix with trade-off analysis for informed decision-making.
  Use when: career options, what if, path comparison, future scenarios,
  职业模拟, 路径对比, 如果我选择. Commands: /career-sim.
  Upstream: Clawsight profile + career-mirror + tech-spectrum.
user-invocable: true
argument-hint: (no arguments)
metadata: { "openclaw": { "emoji": "🔮", "homepage": "https://github.com/jnuyao/clawsight", "version": "1.0.0" } }
---

# Career Sim — 职业路径模拟器

## Quick Start

```
/career-sim             # Simulate 3-5 divergent career paths from YOUR profile
```

Chain: `/career-mirror` → `/tech-spectrum` → **career-sim** → `/tech-compass`

## Mode Detection

1. **Check** for `USER.md`, `MEMORY.md`, `memory/projects/*.md`.
2. **Scan** for `<!-- CAREER_MIRROR_OUTPUT` and `<!-- TECH_SPECTRUM_OUTPUT`.
3. **Extract** verified advantages, spectrum position, opportunity windows from upstream.
4. **Enhanced**: Profile + both upstreams · **Rich**: Profile only · **Lite**: No profile.

## Lite Mode

1. **Ask** for: current role, years of experience, top 3 skills, industry, career goal (if any), risk tolerance (low/medium/high).
2. **Generate** Sections 1 and 3 only (paths + comparison matrix).

## Rich/Enhanced Mode — Full Report

1. **Read** all memory files, upstream outputs. **Never modify any file.**
2. **Generate** the following 4 sections.

### Section 1: Path Generation (3-5 Divergent Paths)

Generate 3-5 **genuinely different** career trajectories. Each path must be:

1. **Grounded**: Based on verified skills, experience, and compound advantages from profile data.
2. **Divergent**: Each path represents a fundamentally different strategic direction, not variations of the same path.
3. **Time-bound**: 3-year projection with yearly milestones.
4. **Named**: Give each path a memorable label (e.g., "The Deep Specialist", "The Platform Builder", "The Domain Crossover").

**Path structure** (for each):
- **Label & Thesis**: One-line strategic rationale
- **Year 1 → Year 2 → Year 3**: Role/focus evolution with concrete milestones
- **Builds on**: Which verified advantages (from career-mirror) this path leverages
- **Requires**: Key gaps to close, new skills to acquire
- **Risk profile**: What could go wrong, market dependency, reversibility
- **AI alignment**: How this path relates to AI disruption trajectory (from tech-spectrum)

**Path generation rules**:
- At least one path should be a **"safe" continuation** of current trajectory
- At least one path should be a **bold pivot** that leverages hidden strengths
- At least one path should be an **AI-native** path that fully embraces the AI shift
- If upstream data reveals a compound advantage, one path should **double down** on it
- Paths must be mutually exclusive at the strategic level (choosing one means not choosing others)

### Section 2: Comparison Matrix

A structured comparison across key dimensions:

| Dimension | Path A | Path B | Path C | ... |
|-----------|--------|--------|--------|-----|
| **Income trajectory** | ↑↑↑ / ↑↑ / ↑ / → / ↓ | ... | ... | |
| **AI-proof score** | 1-5 rating with rationale | ... | ... | |
| **Skill leverage** | % of current skills utilized | ... | ... | |
| **Time to impact** | Months until meaningful results | ... | ... | |
| **Reversibility** | Easy / Medium / Hard to reverse | ... | ... | |
| **Market demand** | Growing / Stable / Shrinking | ... | ... | |
| **Compound advantage fit** | How well it uses your unique combination | ... | ... | |
| **Risk level** | Low / Medium / High with factors | ... | ... | |

### Section 3: Trade-off Analysis

For each pair of paths, explicitly state:
- **What you gain** by choosing Path X over Path Y
- **What you give up** by choosing Path X over Path Y
- **Point of no return**: When does the choice become irreversible?

### Section 4: Decision Framework

1. **If you value stability**: Recommend path + reasoning
2. **If you value growth ceiling**: Recommend path + reasoning
3. **If you value AI-readiness**: Recommend path + reasoning
4. **Hedge strategy**: Can you start Path X while keeping Path Y as a fallback? How long?

> Do NOT make the choice for the user. Present the framework, highlight trade-offs, and let them decide.

## Cross-Skill Data Passing

Append structured output for downstream consumption by tech-compass:

```html
<!-- CAREER_SIM_OUTPUT
chosen_path: (filled after user indicates preference)
path_label: "The Deep Specialist"
path_thesis: "Double down on distributed systems expertise while adding AI-native infrastructure skills"
year1_focus: "AI infrastructure for payment systems"
key_skills_needed: ["MLOps", "vector databases", "AI system design"]
risk_factors: ["market consolidation", "over-specialization"]
ai_alignment: "AI-native"
leverage_advantages: ["payments × distributed × global"]
-->
```

**Note**: The `chosen_path` field is populated when the user indicates their preference. If the user runs `/tech-compass` without choosing, tech-compass generates plans for the top-recommended path and notes alternatives.

## Report Footer

```
*Generated by Career Sim v1.0 | Paths diverge — choose with clarity.*
*Next: Choose a path, then run /tech-compass for your action plan.*
*Full chain: /career-mirror → /tech-spectrum → /career-sim → /tech-compass*
```

## Error Handling

| Situation | Response | Then |
|-----------|----------|------|
| No memory files | — | Lite Mode |
| Upstreams missing | Generate without | Note: "Full chain for richer simulations" |
| Only 1-2 viable paths | Generate what's realistic | Explain why options are limited |
| User already chose a path | Validate choice against data | Offer refined sub-paths within chosen direction |

## Constraints

1. **Genuinely divergent.** Paths must represent different strategic directions. "Senior Engineer" vs "Staff Engineer" is NOT divergent enough.
2. **Evidence-grounded.** Every path must trace to profile data or upstream analysis. No fantasy paths disconnected from reality.
3. **Honest trade-offs.** Never present a path as all-upside. Every path has costs.
4. **No ranking.** Present paths as options, not recommendations. Use the Decision Framework for guidance without prescribing.
5. **Time-realistic.** Year-by-year milestones must be achievable, not aspirational.
6. **Read-only.** Never modify memory files.
7. **Match user language.** Output in user's primary language.
