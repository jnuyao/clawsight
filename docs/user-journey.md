# Clawsight User Journey

## Seven Stages of User Interaction

### Stage 0: Install (5 seconds)

```
User discovers Clawsight on ClawHub
→ clawhub install clawsight
→ "✅ Clawsight installed. Run /clawsight <source> to start."
```

**Design goal**: Zero friction. No configuration, no API keys, no setup.

### Stage 1: First Import (5 minutes)

```
User: /clawsight ./resume.pdf
Agent: [Parses resume, extracts profile, shows preview]
Agent: "🦐 发现 4 段工作经历、12 项技能、3 个项目。确认写入？"
User: 确认
Agent: [Writes to USER.md + MEMORY.md, shows score report]
Agent: "📊 Profile Coverage: 87/100 | Understanding: 54/100
        💡 添加 GitHub 可以补充技术行为数据，提升理解度到 ~75"
```

**Key moment**: The score report shows what's known AND what's missing, creating natural motivation to add more sources.

### Stage 2: Second Source + Insight Report (Wow Moment)

```
User: /clawsight https://github.com/username
Agent: [Fetches GitHub data, cross-references with resume]
Agent: "⚡ 发现跨源洞察：
        1. 简历定位 Java，GitHub 主力已转向 Go (65%)
        2. 周末开源贡献频繁 — 你可能低估了自己的技术热情
        3. 支付×分布式×Go 这个组合在市场上极为稀缺"
User: 😮 (wow moment)
```

**Key moment**: Insights the user couldn't generate themselves. This is where "thin" becomes "thick."

### Stage 3: Silent Enhancement (Daily, Invisible)

After import, Clawsight data improves every interaction with OpenClaw:
- Other skills read USER.md for personalized responses
- Career advice is grounded in actual profile data
- Technical discussions reference real skill levels

The user doesn't invoke Clawsight — they just notice OpenClaw "gets them" better.

### Stage 4: Add More Sources (On-Demand)

When the user encounters a new source:
```
User: /clawsight https://mywebsite.com
Agent: [Imports, reconciles with existing 2 sources]
Agent: "⚡ 新洞察：你的个人网站强调设计能力，但简历和 GitHub 都没提及
        → 这可能是一个被忽视的差异化优势"
```

Each new source deepens the profile AND generates new cross-source insights.

### Stage 5: Potential Discovery (On-Demand)

```
User: /clawsight insight
Agent: [Generates comprehensive insight report]
Agent: "🦐 Clawsight Insight Report
        
        Hidden Strengths:
        - Mentoring 能力被多方验证但从未自我宣传
        
        Behavioral-Declarative Gap:
        - 简历定位管理，GitHub 显示你仍是最活跃的 IC
        
        Compound Advantages:
        - 支付×分布式×全球化：< 0.1% 的人具备这个组合
        
        Future Vectors:
        - 全球支付基础设施架构师（高匹配）
        - 开源支付框架创始人（中匹配）"
```

### Stage 6: Long-Term Evolution (Continuous)

Over time, the profile evolves:
- Re-import updated resume → detect career changes
- New GitHub repos → track skill evolution
- Profile README changes → capture shifting self-identity

Clawsight becomes a **career mirror** — reflecting back an objective view of professional growth.

## Retention Flywheel

```
Trust          → User sees accurate, non-judgmental profile
  ↓
Dependency     → Other OpenClaw skills use the profile, work better
  ↓
Investment     → User adds more sources, enriching the profile
  ↓
Growth         → New insights emerge, user discovers new things about themselves
  ↓
(back to Trust)
```

## Key Design Principles

1. **Value before effort**: First import takes 5 minutes, delivers immediate value
2. **Progressive depth**: Each additional source adds disproportionate insight value
3. **User agency**: Preview-first, user confirms everything, no silent data collection
4. **Transparency**: Every fact traceable to source, every reconciliation decision logged
5. **Insight over data**: The goal isn't to store data — it's to reveal what the data means
