# Clawsight Scoring Methodology

Version: 0.5

## Score A: Profile Coverage (per-source quality)

Measures how complete a single import source is.

| Field Group | Weight | Full Marks Criteria |
|-------------|--------|---------------------|
| Identity (name, headline, location) | 20% | All 3 present |
| Experience (with highlights + tech) | 30% | 2+ entries with highlights |
| Education | 10% | 1+ entry with degree + field |
| Skills (technical + domain) | 20% | 5+ technical, 1+ domain |
| Projects | 20% | 1+ project with description |

Score range: 0–100.

## Score B: Assistant Understanding (total memory state)

Measures how well the assistant knows the user across all sources.

| Category | Weight | What to Look For |
|----------|--------|-----------------|
| Identity | 20% | Name, headline, location in USER.md |
| Career & Skills | 25% | Experience + skills in USER.md and MEMORY.md |
| Projects | 20% | Files in memory/projects/ |
| Interests | 15% | Hobbies, communities, reading lists |
| Work Style | 10% | Communication prefs, tools, methodology |
| Relationships | 10% | Colleagues, mentors, collaborators |

Score range: 0–100. Low Interests/WorkStyle/Relationships after resume import is **expected** — these are enriched through conversation and additional sources.

## Confidence Scoring with Multi-Source Corroboration

```
Base confidence = source_type_weight (0.5 ~ 0.9)

Multi-source adjustments:
  + 0.10  corroborated by another source (same fact, different source)
  + 0.05  each additional corroborating source (diminishing returns)
  - 0.15  contradicted by a higher-trust source
  - 0.05  per validation warning

Final confidence = clamp(adjusted, 0.0, 1.0)
  → high:   ≥ 0.80
  → medium: 0.50 – 0.79
  → low:    < 0.50
```

## Source-Domain Trust Matrix

When conflicts cannot be auto-resolved, use this trust hierarchy:

| Trust Tier | Confidence Weight | Examples |
|------------|-------------------|----------|
| Behavioral (what you DO) | 0.9 | GitHub commits, contribution patterns, language stats |
| Declarative (what you SAY) | 0.7 | Resume, LinkedIn profile, personal website |
| Third-party (what OTHERS say) | 0.8 | LinkedIn recommendations |
| Inferred (what we DEDUCE) | 0.5 | Patterns derived from cross-referencing |

### Trust Specialization by Domain

| Domain | Most Trusted Source | Reason |
|--------|-------------------|--------|
| Technical skills | GitHub (behavioral) | Actual code reveals real proficiency |
| Career narrative | Resume (declarative) | User's intentional professional framing |
| Working style | GitHub events (behavioral) | Commit patterns don't lie |
| Soft skills | LinkedIn recs (third-party) | Third-party endorsement |
| Project impact | Resume highlights (declarative) | Metrics not visible in code |

## Score Adjustment on Validation

Starting from source baseline:
- −0.05 per validation warning
- −0.10 per validation error
- −0.05 if web content had noise
- Apply multi-source corroboration adjustments (see above)
