# Scene Skills Protocol

> Standard protocol for Clawsight Scene Skills — how they consume profile data, interact with each other, and degrade gracefully.

## What is a Scene Skill?

A Scene Skill is a standalone SKILL.md that consumes Clawsight's profile data (USER.md, MEMORY.md, memory/projects/*) for specialized analysis. Scene Skills are **read-only consumers** — they never write to Clawsight's memory files.

## Design Principles

1. **Read-only access**: Scene Skills read profile data but never modify it
2. **Graceful degradation**: Must work without profile data (Lite Mode), better with it (Rich/Enhanced Mode)
3. **Evidence-first**: All claims must cite specific data sources with confidence markers
4. **Independent installability**: Each Scene Skill is a standalone SKILL.md
5. **Size budget**: < 6KB per SKILL.md (methodology docs extracted to `docs/`)
6. **Language matching**: Output in the user's language

## Operating Modes

| Mode | Condition | Experience |
|------|-----------|------------|
| **Enhanced** | Profile + upstream skill outputs available | Full chain analysis with cross-validated data |
| **Rich** | ≥1 Clawsight source file found with relevant data | Profile-driven analysis |
| **Lite** | No profile data available | Interactive Q&A, still useful but less personalized |

### Mode Detection Logic

```
1. Check for USER.md, MEMORY.md, memory/projects/*.md
2. Check for upstream skill output blocks (<!-- SKILL_OUTPUT ... -->)
3. If upstream outputs found → Enhanced Mode
4. If ≥1 source found with relevant data → Rich Mode
5. If no profile data → Lite Mode
```

## Cross-Skill Data Passing

### Format

Skills pass structured data via HTML comment blocks appended to the end of reports:

```html
<!-- SKILL_NAME_OUTPUT
key1: value1
key2:
  - item1
  - item2
nested:
  sub_key: sub_value
-->
```

### Rules

1. **Append-only**: Output blocks are appended after the visible report
2. **YAML format**: Content inside comment blocks uses YAML syntax
3. **Namespaced**: Each skill uses its own prefix (e.g., `CAREER_MIRROR_OUTPUT`, `TECH_SPECTRUM_OUTPUT`, `CAREER_SIM_OUTPUT`)
4. **Optional consumption**: Downstream skills check for but don't require upstream outputs
5. **No circular dependencies**: Data flows in one direction only

### Current Data Flow (4-Skill Chain)

```
career-mirror → CAREER_MIRROR_OUTPUT
                    ↓
              tech-spectrum → TECH_SPECTRUM_OUTPUT
                                   ↓
                            career-sim → CAREER_SIM_OUTPUT
                                              ↓
                                        tech-compass (reads all upstreams)
```

## Invocation Patterns

### Slash Commands

Each Scene Skill registers a slash command:

| Command | Skill |
|---------|-------|
| `/career-mirror` | Career introspection |
| `/tech-spectrum` | AI disruption positioning |
| `/career-sim` | Divergent career path simulation |
| `/tech-compass` | Action planning |

### Natural Language Triggers

Each SKILL.md defines natural language trigger patterns. Examples:
- "analyze my career" → career-mirror
- "where do I stand with AI" → tech-spectrum
- "what are my career options" → career-sim
- "what should I learn next" → tech-compass

### Chain Invocation

Users can trigger the full chain:
- Run `/career-mirror` first
- Then `/tech-spectrum` (auto-detects career-mirror output)
- Then `/career-sim` (auto-detects both upstream outputs)
- Then `/tech-compass` (auto-detects all upstream outputs, aligns to chosen path)

Or run any skill independently — each degrades gracefully without upstream data.

## Constraints for All Scene Skills

1. **Evidence-first**: Every claim must reference specific profile data or state the basis
2. **Observation, not prescription** (career-mirror specific): Describe what IS, not what SHOULD BE
3. **Read-only**: Never suggest modifying USER.md/MEMORY.md directly
4. **Constructive framing**: Present gaps as opportunities, not failures
5. **Confidence marking**: Use [high]/[medium]/[low] confidence indicators
6. **Scope boundary**: Each skill has a defined scope — do not overlap with other skills' domains

## MCP Enhancement Path

| Phase | Capability | Data Sources |
|-------|-----------|-------------|
| Phase 1 (current) | Pure Skill | LLM knowledge only |
| Phase 2 | MCP tools | Web search, job market APIs, trend APIs |
| Phase 3 | Data layer | Structured trend database, historical tracking |

Phase 2+ enhancements are additive — Phase 1 functionality is always the fallback.
