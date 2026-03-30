// ============================================================
// LLM Extractor — Use Claw's model to do structured extraction
//
// v0.1.1: Fixed hardcoded source_format, improved prompt
// ============================================================

import {
  CanonicalResume,
  createEmptyResume,
  SourceFormat,
  Experience,
  Education,
  Project,
} from '../schemas/canonical-resume';
import { normalizeDate } from '../utils/date-utils';

/**
 * LLM provider interface — allows plugging in different backends.
 */
export interface LLMProvider {
  chat(systemPrompt: string, userPrompt: string): Promise<Record<string, any>>;
}

/**
 * Default LLM provider using OpenClaw's tool interface.
 * Falls back to direct API call if OPENAI_API_KEY or
 * ANTHROPIC_API_KEY is set.
 */
export class DefaultLLMProvider implements LLMProvider {
  async chat(
    systemPrompt: string,
    userPrompt: string
  ): Promise<Record<string, any>> {
    // Strategy 1: Use OpenClaw's built-in LLM if available
    if (typeof globalThis !== 'undefined' && (globalThis as any).__claw_llm__) {
      const clawLlm = (globalThis as any).__claw_llm__;
      const response = await clawLlm.chat({
        system: systemPrompt,
        user: userPrompt,
        response_format: { type: 'json_object' },
        temperature: 0,
      });
      return JSON.parse(response.content);
    }

    // Strategy 2: Use OpenAI-compatible API
    const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
    const baseUrl = process.env.LLM_BASE_URL || 'https://api.openai.com/v1';
    const model = process.env.LLM_MODEL || 'gpt-4o-mini';

    if (!apiKey) {
      throw new Error(
        'No LLM provider available. Set OPENAI_API_KEY, ANTHROPIC_API_KEY, ' +
        'or run within OpenClaw agent context.'
      );
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0,
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status} ${await response.text()}`);
    }

    const result: any = await response.json();
    const content = result.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty LLM response');

    return JSON.parse(content);
  }
}

// ============================================================
// Resume Extraction Prompt
// ============================================================

const RESUME_EXTRACTION_SYSTEM_PROMPT = `You are a precise resume parser. Extract structured information from the provided resume text.

RULES:
1. Extract ONLY what is explicitly stated. Do NOT infer or fabricate information.
2. If a field is not found, use empty string "" or empty array [].
3. Dates should be in ISO format: "YYYY-MM" or "YYYY-MM-DD". Use "YYYY-01" if only year is given.
4. For "present" or "至今" or "current", use null for end date.
5. Highlights should be quantified achievements when possible. Extract bullet points as highlights.
6. Technologies should be specific: "React" not "frontend framework".
7. Separate technical skills from soft skills and domain knowledge.
8. If the resume is structured with sections (Experience, Education, etc.), follow that structure.
9. For each work experience, extract ALL bullet points as highlights.
10. Domain knowledge examples: "payments", "ad delivery", "marketing automation", "analytics".

OUTPUT FORMAT: Return a single JSON object with this exact structure:
{
  "identity": {
    "name": "string",
    "headline": "string or null",
    "location": "string or null",
    "timezone": "string or null",
    "contact": {
      "email": "string or null",
      "phone": "string or null",
      "linkedin": "string or null",
      "github": "string or null",
      "website": "string or null"
    }
  },
  "experience": [
    {
      "company": "string",
      "title": "string",
      "start_date": "YYYY-MM or null",
      "end_date": "YYYY-MM or null",
      "description": "string or null",
      "highlights": ["string - each bullet point or achievement"],
      "technologies": ["string - specific tech mentioned"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "start_date": "YYYY-MM or null",
      "end_date": "YYYY-MM or null",
      "gpa": "string or null"
    }
  ],
  "skills": {
    "technical": ["string - programming languages, frameworks, tools"],
    "domain": ["string - business domains and expertise areas"],
    "soft": ["string - leadership, communication, etc."],
    "certifications": ["string"]
  },
  "projects": [
    {
      "name": "string",
      "role": "string",
      "description": "string",
      "technologies": ["string"],
      "url": "string or null"
    }
  ],
  "confidence": 0.85
}`;

// ============================================================
// Extractor Class
// ============================================================

export class LLMExtractor {
  private provider: LLMProvider;
  private maxRetries: number;

  constructor(provider?: LLMProvider, maxRetries = 2) {
    this.provider = provider || new DefaultLLMProvider();
    this.maxRetries = maxRetries;
  }

  /**
   * Extract a CanonicalResume from raw text using LLM.
   * @param text - The text to extract from
   * @param sourceFormat - The source format (defaults to 'plain_text')
   * @param sourceFile - The source file path or URL
   */
  async extractResume(
    text: string,
    sourceFormat: SourceFormat = 'plain_text',
    sourceFile?: string
  ): Promise<CanonicalResume> {
    // Truncate if too long (most LLMs have context limits)
    const maxChars = 30000;
    const truncated = text.length > maxChars
      ? text.slice(0, maxChars) + '\n\n[... truncated ...]'
      : text;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const raw = await this.provider.chat(
          RESUME_EXTRACTION_SYSTEM_PROMPT,
          `Please extract structured resume data from the following text:\n\n${truncated}`
        );

        return this.mapRawToCanonical(raw, sourceFormat, sourceFile);
      } catch (err) {
        lastError = err as Error;
        console.warn(
          `[LLM Extractor] Attempt ${attempt + 1} failed: ${lastError.message}`
        );
      }
    }

    throw new Error(
      `LLM extraction failed after ${this.maxRetries + 1} attempts: ${lastError?.message}`
    );
  }

  /**
   * Map raw LLM output to CanonicalResume.
   */
  private mapRawToCanonical(
    raw: Record<string, any>,
    sourceFormat: SourceFormat = 'plain_text',
    sourceFile?: string
  ): CanonicalResume {
    const identity = raw.identity || {};
    const contact = identity.contact || {};

    const resume = createEmptyResume(sourceFormat, sourceFile);

    resume.identity = {
      name: identity.name || '',
      headline: identity.headline || undefined,
      location: identity.location || undefined,
      timezone: identity.timezone || undefined,
      contact: {
        email: contact.email || undefined,
        phone: contact.phone || undefined,
        linkedin: contact.linkedin || undefined,
        github: contact.github || undefined,
        website: contact.website || undefined,
      },
    };

    resume.experience = (raw.experience || []).map((e: any): Experience => ({
      company: e.company || '',
      title: e.title || e.position || '',
      period: {
        start: normalizeDate(e.start_date || e.startDate) || '',
        end: normalizeDate(e.end_date || e.endDate) || undefined,
      },
      description: e.description || undefined,
      highlights: Array.isArray(e.highlights) ? e.highlights.filter(Boolean) : [],
      technologies: Array.isArray(e.technologies) ? e.technologies.filter(Boolean) : [],
    }));

    resume.education = (raw.education || []).map((e: any): Education => ({
      institution: e.institution || '',
      degree: e.degree || e.studyType || '',
      field: e.field || e.area || '',
      period: {
        start: normalizeDate(e.start_date || e.startDate) || '',
        end: normalizeDate(e.end_date || e.endDate) || undefined,
      },
      gpa: e.gpa || e.score || undefined,
    }));

    const skills = raw.skills || {};
    resume.skills = {
      technical: Array.isArray(skills.technical) ? skills.technical.filter(Boolean) : [],
      domain: Array.isArray(skills.domain) ? skills.domain.filter(Boolean) : [],
      soft: Array.isArray(skills.soft) ? skills.soft.filter(Boolean) : [],
      certifications: Array.isArray(skills.certifications) ? skills.certifications.filter(Boolean) : [],
    };

    resume.projects = (raw.projects || []).map((p: any): Project => ({
      name: p.name || '',
      role: p.role || '',
      description: p.description || '',
      technologies: Array.isArray(p.technologies) ? p.technologies.filter(Boolean) : [],
      url: p.url || undefined,
    }));

    resume._meta.confidence = typeof raw.confidence === 'number'
      ? raw.confidence
      : 0.80;

    return resume;
  }
}
