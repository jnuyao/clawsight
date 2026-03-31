# Tech Compass — Scene Skill Prompt Template

> **Deprecated**: This file is a legacy prompt template from v0.3. The full implementation is now in [`skills/tech-compass/SKILL.md`](../../skills/tech-compass/SKILL.md).

## Current Implementation

Tech Compass has been promoted to a full Scene Skill in v0.6.0 with:

- **Skill Quadrant Matrix**: Your-Level × Market-Demand → Core Assets / Priority Investment / Moat / Deprioritize
- **AI Skill Layer Assessment**: L0 (User) → L4 (Definer) progression with evidence-based placement
- **Learning Routes**: Personalized paths based on compound advantages from career-mirror
- **30-60-90 Day Action Plan**: Concrete milestones with success criteria
- **Risk & Adaptation**: Disruption timeline + contingency planning

## Usage

```
/tech-compass
```

## Three Operating Modes

| Mode | Condition | Input Sources |
|------|-----------|---------------|
| Enhanced | Profile + upstream skill outputs | career-mirror + tech-spectrum outputs |
| Rich | Profile data available | USER.md, MEMORY.md, memory/projects/* |
| Lite | No profile data | Interactive Q&A only |

## Skill Chain

Tech Compass is the action endpoint of the career intelligence chain:

```
career-mirror (introspection) → tech-spectrum (positioning) → tech-compass (action)
```

## References

- [SKILL.md](../../skills/tech-compass/SKILL.md) — Full implementation
- [README.md](../../skills/tech-compass/README.md) — User-facing documentation
- [skill-layers.md](../../docs/skill-layers.md) — AI Skill Layers L0-L4 detailed criteria
- [scene-skills-protocol.md](../../docs/scene-skills-protocol.md) — Cross-skill interaction protocol
