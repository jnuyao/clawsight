# Clawsight Canonical Extraction Schema

Version: 0.5 — Full specification for structured data extracted in Step 3a.

## JSON Schema

```json
{
  "source_type": "github | resume_pdf | website | json_resume | linkedin | linkedin_recommendations | plain_text",
  "source_url": "original URL or file path",
  "extraction_time": "ISO 8601 timestamp",

  "identity": {
    "name": "Full name",
    "headline": "Professional title / one-line summary",
    "location": "City, Country",
    "contact": {
      "email": "if explicitly shown",
      "phone": "if explicitly shown",
      "github": "GitHub URL",
      "linkedin": "LinkedIn URL",
      "website": "Personal site URL"
    }
  },

  "experience": [{
    "company": "Company name",
    "title": "Job title / role",
    "team": "Team or department (if mentioned)",
    "start": "YYYY-MM",
    "end": "YYYY-MM or null if current",
    "description": "Role summary",
    "highlights": ["Quantified achievement with numbers"],
    "technologies": ["Specific tech: React, Go, PostgreSQL"]
  }],

  "education": [{
    "institution": "School name",
    "degree": "Degree type",
    "field": "Field of study",
    "start": "YYYY-MM",
    "end": "YYYY-MM",
    "achievements": ["Awards, scholarships, honors"]
  }],

  "skills": {
    "technical": ["Languages, frameworks, tools, platforms"],
    "domain": ["Business domains: payments, ads, marketing, analytics"],
    "soft": ["Leadership, communication, etc."],
    "certifications": ["Formal certifications"]
  },

  "projects": [{
    "name": "Project name",
    "role": "Your role",
    "description": "What the project does",
    "technologies": ["Tech used"],
    "url": "URL if available",
    "stars": "GitHub stars if applicable",
    "is_fork": false
  }],

  "behavioral_signals": {
    "contribution_pattern": "weekday-heavy | weekend-active | consistent",
    "coding_schedule": "morning-coder | night-owl | business-hours | mixed",
    "consistency_score": "0.0-1.0 (regularity of contributions over time)",
    "collaboration_ratio": "0.0-1.0 (PRs/issues on others' repos vs own repos)",
    "language_distribution": {"Go": 0.65, "Python": 0.25},
    "activity_recency": "YYYY-MM-DD of last activity",
    "open_source_engagement": "high | medium | low | none"
  },

  "recommendations": [{
    "recommender_name": "Name of person giving recommendation",
    "relationship": "Manager | Colleague | Report | Client | Other",
    "key_themes": ["mentoring", "technical depth", "leadership"],
    "summary": "Brief summary of recommendation content"
  }],

  "evolution": {
    "previous_snapshot_date": "ISO date of last import, if applicable",
    "changes": [
      {
        "field": "skills.technical",
        "type": "added | removed | changed",
        "detail": "Added Rust (3 new projects since last refresh)"
      }
    ]
  }
}
```

## Extraction Rules

1. **Dates**: Convert to ISO `YYYY-MM`. Only year → `YYYY-01`. "至今"/"present"/"current" → `null` for end date.
2. **Highlights**: Quantified where possible: "Reduced latency 171min → 105min (-39%)".
3. **Technologies**: Use specific names (e.g., "FastAPI"), not categories (e.g., "web framework").
4. **Language**: Keep original. Chinese resume → Chinese output.
5. **Same company, different roles**: Create separate experience entries.
6. **`behavioral_signals`**: Only populated from GitHub source type.
7. **`recommendations`**: Only populated from LinkedIn export ZIP containing `recommendations.json`.
8. **`evolution`**: Only populated during `/clawsight refresh` when previous data exists.
9. **No fabrication**: If a field is not in the source, leave it empty. Do NOT guess.

## Provenance Tagging

Every extracted fact carries provenance:

```
[source: {source_type}] [date: {extraction_time}] [confidence: {high|medium|low}]
```

Confidence assignment:
- **high**: Explicitly stated in source (e.g., job title in resume header)
- **medium**: Inferred from context (e.g., skill derived from project description)
- **low**: Ambiguous or partial information
