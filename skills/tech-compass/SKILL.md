---
name: tech-compass
version: 1.2.0
description: >
  AI-era growth planning calibrated to technical depth. Implementation
  projects for engineers, tool adoption for non-technical users, cognition
  verification at every level. Projects as launchpads. Use when: what to learn, growth plan, roadmap, skill gap,
  我该学什么, 成长路线, 学习路径. Commands: /tech-compass.
  Upstream: Clawsight profile + career-mirror + tech-spectrum + career-sim.
user-invocable: true
argument-hint: (no arguments)
metadata: { "openclaw": { "emoji": "🧭", "homepage": "https://github.com/jnuyao/clawsight", "version": "1.2.0" } }
---

# Tech Compass — 技术成长导航

## Quick Start

```
/tech-compass           # Growth plan at YOUR depth, in YOUR projects
```

Chain: `/career-mirror` → `/tech-spectrum` → `/career-sim` → **tech-compass**

## Mode Detection

1. **Check** for `USER.md`, `MEMORY.md`, `memory/projects/*.md`.
2. **Scan** for `<!-- CAREER_MIRROR_OUTPUT`, `<!-- TECH_SPECTRUM_OUTPUT`, and `<!-- CAREER_SIM_OUTPUT`.
3. **Extract** `technical_depth` from upstream. If missing, infer or default to `mixed`.
4. **If career-sim output found**: Use `chosen_path` to focus recommendations on the selected trajectory. If no path chosen, use the top-recommended path and note alternatives.
5. **Enhanced**: Profile + upstream(s) · **Rich**: Profile only · **Lite**: No profile.

## Lite Mode

1. **Ask** for: role, tech stack, current project, target direction, hours/week, technical background (yes/no).
2. **Generate** Sections 1 and 4 only.

## Adaptive Depth Rule

**This is the most critical rule in tech-compass.** Reference `${CLAUDE_SKILL_DIR}/docs/adaptive-depth.md`.

- **Technical users**: Recommend repos (nanoGPT, llama.cpp, LangChain), papers, implementation challenges. Verify: "Can you implement this from scratch?"
- **Mixed users**: Recommend tutorials, API integrations, tool-building. Verify: "Can you solve a real problem with this?"
- **Non-technical users**: Recommend tools (ChatGPT, Zapier AI, Custom GPTs), workflow changes, conceptual understanding. Verify: "Can you explain this to a colleague and identify where it applies?"

## Rich/Enhanced Mode — Full Report

1. **Read** all memory files, upstream outputs, `${CLAUDE_SKILL_DIR}/docs/skill-layers.md`, `${CLAUDE_SKILL_DIR}/docs/adaptive-depth.md`. **Never modify any file.**
2. **If career-sim output available**: Align all sections to the chosen career path. Reference `chosen_path`, `key_skills_needed`, and `ai_alignment` from `CAREER_SIM_OUTPUT`.
3. **Generate** the following 5 sections.

### Section 1: Skill Quadrant Matrix

1. **Map** skills: X = Your Level (verification data), Y = Market Demand.
2. **Classify**: 💎 Core Asset · 🎯 Priority Investment · 🏛️ Moat · ⏸️ Deprioritize.
3. **Assess** shape: current (I/T/π/Comb) → recommended evolution.
4. **If career-sim path chosen**: Weight market demand toward the chosen trajectory's requirements.

### Section 2: AI Skill Layer Assessment

1. **Place** on L0-L4 with evidence. Reference skill-layers.md.
2. **State** current → target → gap. Calibrate target by career phase.
3. **If career-sim path chosen**: Calibrate target layer to the chosen path's AI alignment level.
4. **For technical users**: Distinguish "understands concept" vs "can implement." E.g., "You use RAG tools (L1) but haven't built a retrieval pipeline from scratch (L2 gap)."
5. **For non-technical users**: Frame layers as impact levels, not technical skill. E.g., "L1 = you use AI to do your job faster. L2 = you design AI-powered workflows for your team."

### Section 3: Project-as-Launchpad Routes

**Core principle**: Learn by building in projects you already own. For each project from tech-spectrum, design a depth-appropriate AI integration:

**If career-sim path chosen**: Prioritize projects and routes that align with the chosen trajectory. Reference `year1_focus` and `key_skills_needed` from career-sim output.

**Technical users:**
- **What to build**: Specific implementation (e.g., "RAG pipeline for your reconciliation docs using LangChain + Chroma").
- **Study first**: Specific repo or paper (e.g., "Study nanoGPT for attention fundamentals, then Annotated Transformer for implementation patterns").
- **Verify understanding**: "You'll know you get it when you can modify the attention mechanism and predict what changes in output."

**Non-technical users:**
- **What to adopt**: Specific tool or workflow change (e.g., "Set up a Custom GPT trained on your team's SOPs for instant onboarding Q&A").
- **Understand first**: Concept framed as analogy (e.g., "RAG = giving AI a reference book. Your reconciliation docs become the AI's study guide.").
- **Verify understanding**: "You'll know you get it when you can explain to your manager why this saves 10 hours/week and what it can't handle."

2-3 routes with monthly milestones. Each: Build, Learn (just-in-time), Verify.

### Section 4: 30-60-90 Day Action Plan

Every action ties to a project AND matches proficiency:

1. **🔴 This Week** (2 actions):
   - Technical: "Clone nanoGPT, run training on your domain data, trace the attention computation."
   - Non-technical: "Use ChatGPT to draft 5 reconciliation dispute responses, compare quality vs manual."
2. **🟡 30-Day**: Measurable goal + verification method.
3. **🟢 90-Day**: Outcome + expected spectrum position shift.

**If career-sim path chosen**: All actions must serve the chosen trajectory. Reference the path's year-1 focus.

> Any action that says "take a course" without a project connection must be rewritten.

### Section 5: Risk & Adaptation

1. **Per route**: warning signals, pivot, salvageable value.
2. **If career-sim path chosen**: Include risk factors from `CAREER_SIM_OUTPUT` and mitigation strategies.
3. **Trend shift?** Signals to monitor + adaptation.
4. **No project access?** Open-source domain replicas as fallback.

## Report Footer

```
*Generated by Tech Compass v1.2 | A map, not a rail.*
*Re-run: /clawsight refresh → /career-mirror → /tech-spectrum → /career-sim → /tech-compass*
```

## Error Handling

| Situation | Response | Then |
|-----------|----------|------|
| No memory files | — | Lite Mode |
| Upstreams missing | Generate without | Note: "Full chain for best results" |
| career-sim not run | Generate without path focus | Note: "Run /career-sim first for path-aligned planning" |
| No projects | Ask user to describe one | Use for Section 3-4 |
| Proficiency unclear | Default `mixed` | Ask: "Are you comfortable reading code?" |

## Constraints

1. **Proficiency-calibrated.** EVERY recommendation matches user's depth. Never tell non-technical users to "read the paper." Never tell engineers to just "use the tool."
2. **Project-grounded.** Tie to real projects. Not "learn RAG" but "build RAG for {project X}."
3. **Cognition-verified.** Every milestone includes a "you'll know you understand when..." check appropriate to the user's level.
4. **Evidence-linked.** Trace to profile or upstream data.
5. **Path-aligned.** When career-sim output is available, all recommendations serve the chosen trajectory.
6. **Read-only.** Never modify memory files.
7. **Match user language.** Output in user's primary language.
