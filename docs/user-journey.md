# Clawsight User Journey

> The complete interaction lifecycle from install through long-term use.

## Seven Stages

### Stage 0: Install (5 seconds)

**User action**: `/install clawsight` in OpenClaw

**What happens**:
- SKILL.md loaded into agent context
- No setup, no config, no API keys needed

**User feels**: "That was easy"

---

### Stage 1: First Import (5 minutes)

**User action**: `/clawsight resume.pdf` or `/clawsight https://github.com/username`

**What happens**:
1. Source detected and fetched
2. Content parsed into structured profile
3. Privacy preview shown
4. User confirms → USER.md + MEMORY.md created

**User feels**: "It understood my background quickly and accurately"

**Critical moment**: The preview must be impressive enough to earn trust. If it misparses or hallucinates, trust is broken on Day 1.

---

### Stage 2: Insight Report — The Wow Moment (10 minutes)

**Triggered when**: User has 2+ sources imported, or runs `/clawsight insight`

**What happens**:
1. Cross-source reconciliation identifies patterns
2. 5 insight types generated
3. User sees things about themselves they hadn't articulated

**Example wow moments**:
- "Your resume says Java lead, but your GitHub shows 90% Go — you may be in a tech stack transition you haven't updated your narrative for"
- "3 LinkedIn recommenders mention your mentoring ability, but your resume doesn't mention leadership at all"
- "Payment systems × distributed architecture × global experience — this combination is extremely rare"

**User feels**: "This tool sees something about me I didn't see myself"

**This is the retention hook.** If Stage 2 doesn't produce a wow moment, the user won't continue.

---

### Stage 3: Silent Enhancement (Daily, invisible)

**Triggered by**: Step 8 — Dialogue-Based Profile Enrichment (v0.5)

**What happens**:
- During normal conversations, Clawsight passively notices new info
- "I spent the weekend building a Rust project" → detects new skill signal
- After current task completes: "💡 I noticed you mentioned Rust. Update your profile?"
- User confirms → lightweight update to relevant sections

**User feels**: "It's quietly getting to know me better without being annoying"

**Critical constraint**: NEVER interrupt the user's current task. Non-intrusive is non-negotiable.

---

### Stage 4: Add Sources (On-demand)

**User action**: `/clawsight https://github.com/username` (after initial resume import)

**What happens**:
1. New source imported
2. Cross-source reconciliation runs against all existing data
3. New insights generated from cross-referencing
4. Conflicts presented if any
5. Profile updated with multi-source confidence boosts

**User feels**: "Each source I add makes it understand me dramatically better — not just additive, but multiplicative"

**The insight quality gap between 1 source and 3 sources is massive.** This is what makes Clawsight "thick" — the cross-correlation is something users cannot replicate by pasting their resume into an AI chat.

---

### Stage 5: Potential Discovery (On-demand)

**User action**: `/clawsight potential` (v0.5)

**What happens**:
1. User's compound advantages analyzed
2. Industry trends searched
3. Advantages mapped against market demand
4. Opportunity gaps identified
5. Potential Vectors report generated

**User feels**: "It's not just telling me who I am, but who I could become"

**This is Layer 3** — the frontier. No other tool does this.

---

### Stage 6: Scene Skills — Profile Consumption

**User action**: `/career-mirror`, `/tech-compass`, etc.

**What happens**:
- Scene Skills read USER.md + MEMORY.md
- Generate specialized analyses powered by profile depth
- Rich Mode (with profile) vs Lite Mode (without)

**User feels**: "My profile is becoming a platform that powers increasingly useful tools"

**Ecosystem effect**: Each Scene Skill makes the profile more valuable → user invests more in keeping it updated → better Scene Skill results → more Scene Skills adopted

---

### Stage 7: Long-term Evolution

**User action**: `/clawsight refresh` periodically (v0.4)

**What happens**:
1. All sources re-fetched
2. Changes detected and tracked
3. Profile Evolution Log updated
4. User sees their growth trajectory

**User feels**: "It's a living document of my professional growth"

**The flywheel**:
```
Trust → Dependency → Investment → Growth → More Trust
  │                                            │
  └────────────────────────────────────────────┘
```

## Retention Mechanisms

| Stage | Hook | Risk if Missing |
|-------|------|-----------------|
| 1 | Accurate first parse | User never returns |
| 2 | Wow-moment insight | "This is just a fancy resume parser" |
| 3 | Non-intrusive enrichment | "Too annoying" or "forgot it exists" |
| 4 | Multiplicative cross-source value | "I could do this myself" |
| 5 | Future potential mapping | "It only looks backward" |
| 6 | Scene Skill ecosystem | "One-trick pony" |
| 7 | Growth tracking | "Static snapshot, not a living profile" |

## The "Thin vs Thick" Spectrum

**Thin** (user can do themselves):
- Paste resume → ask AI to remember → done
- Single source, no cross-referencing, no insights

**Thick** (only Clawsight can do):
- Multi-source import with cross-correlation
- Contradictions-as-insights discovery
- Compound advantage identification
- Industry trend × personal advantage mapping
- Profile evolution tracking
- Scene Skill ecosystem consumption

The distance between "thin" and "thick" is the product's moat.
