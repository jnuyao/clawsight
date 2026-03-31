# Career Sim — Divergent Career Path Simulator

> Part of the [Clawsight](https://github.com/jnuyao/clawsight) Career Intelligence Chain.

## What It Does

Career Sim generates **3-5 genuinely divergent career trajectories** based on your profile data, verified advantages, and AI disruption positioning. Instead of asking "what should I do next?", it asks "what are my realistic options, and what does each path cost?"

## The Career Intelligence Chain

```
🪞 career-mirror → 🌈 tech-spectrum → 🔮 career-sim → 🧭 tech-compass
   (who am I?)      (where do I       (what paths     (action plan for
                      stand?)           are open?)      chosen path)
```

Career Sim sits between positioning (tech-spectrum) and planning (tech-compass). It transforms analysis into **concrete, comparable options**.

## Quick Start

```bash
# Best: Run the full chain
/career-mirror
/tech-spectrum
/career-sim          # ← You are here
/tech-compass        # Run after choosing a path

# Also works standalone
/career-sim          # Lite Mode with interactive Q&A
```

## What You Get

### 1. Divergent Path Generation
- 3-5 career trajectories, each a **fundamentally different strategic direction**
- 3-year projections with yearly milestones
- Each path grounded in your verified skills and compound advantages

### 2. Comparison Matrix
- Side-by-side comparison across 8 dimensions
- Income trajectory, AI-proof score, skill leverage, reversibility, and more

### 3. Trade-off Analysis
- Explicit gain/loss for each pair of paths
- Points of no return — when choices become irreversible

### 4. Decision Framework
- Recommendations by priority (stability, growth, AI-readiness)
- Hedge strategies — start one path while keeping another as fallback

## Operating Modes

| Mode | When | Experience |
|------|------|------------|
| **Enhanced** | Profile + career-mirror + tech-spectrum outputs | Full simulation with cross-validated data |
| **Rich** | Clawsight profile only | Profile-driven paths, less upstream context |
| **Lite** | No profile data | Interactive Q&A — still generates useful paths |

## What Flows Downstream

Career Sim passes your chosen path (or top recommendation) to tech-compass via structured data. Tech-compass then builds a concrete action plan calibrated to that specific trajectory.

## Example Paths

For a senior payment systems engineer with Go expertise and leadership signals:

- **🏗️ The Infrastructure Architect**: Double down on distributed systems → AI infrastructure lead
- **🚀 The Platform Builder**: Leverage domain expertise → build AI-powered payment platform
- **🔄 The Domain Crossover**: Apply systems thinking to adjacent field (fintech AI, developer tools)
- **👥 The Engineering Leader**: Follow the leadership signals → VP Engineering path
- **🌊 The AI-Native Pioneer**: Full pivot to AI/ML engineering leveraging systems background

## Links

- [SKILL.md](SKILL.md) — Full skill specification
- [Scene Skills Protocol](../../docs/scene-skills-protocol.md) — How skills interact
- [Changelog](../../docs/changelog.md) — Version history
