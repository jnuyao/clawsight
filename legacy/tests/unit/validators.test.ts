// ============================================================
// Unit Tests: Validators (Schema + Semantic + Confidence)
// ============================================================

import { validateSchema } from '../../src/validators/schema-validator';
import { validateSemantics } from '../../src/validators/semantic-validator';
import { scoreConfidence } from '../../src/validators/confidence-scorer';
import { CanonicalResume, createEmptyResume } from '../../src/schemas/canonical-resume';
import { MockLLMProvider } from '../helpers/mock-llm-provider';
import { LLMExtractor } from '../../src/extractors/llm-extractor';

function buildYaohomResume(): CanonicalResume {
  // Build a realistic resume matching the mock LLM output
  const mockLlm = new MockLLMProvider();
  const extractor = new LLMExtractor(mockLlm);
  // We'll build it manually to avoid async
  const resume = createEmptyResume('url', 'https://yaohom.vercel.app/');
  resume.identity = {
    name: 'Yaohong Zheng',
    headline: 'AI Agent Infra / Agent Runtime / Backend Architecture / Engineering Lead',
    contact: {
      github: 'https://github.com/jnuyao',
      website: 'https://yaohom.vercel.app/',
    },
  };
  resume.experience = [
    {
      company: 'ByteDance',
      title: 'Technical Owner, Payout Dispatch',
      period: { start: '2024-02' },
      description: 'Owned payout dispatch and stability for ByteDance International Payments.',
      highlights: [
        'Built a unified dispatch system from 0 to 1',
        'Reduced payout average duration from 171 min to 105 min (-39%)',
        'Expanded dispatch governance to 48.4% of daily flow',
      ],
      technologies: ['payout orchestration', 'rate limiting', 'observability'],
    },
    {
      company: 'Tencent Ads',
      title: 'Engineering and Team Management',
      period: { start: '2021-09', end: '2024-01' },
      description: 'Led private-domain marketing platform.',
      highlights: [
        'Led storage and computing for billion-scale user-behavior data',
        'Built systems for sharding, user profiles, full-text search',
      ],
      technologies: ['sharding', 'full-text search', 'marketing automation'],
    },
    {
      company: 'Ant Group / Freshippo',
      title: 'Ad Delivery, Marketing Platforms',
      period: { start: '2017-12', end: '2021-09' },
      description: 'DSP, marketing platform, and growth initiatives.',
      highlights: [
        'Built RTB DSP from 0 to 1, handling 10B PV/day',
      ],
      technologies: ['RTB', 'DSP', 'high-concurrency'],
    },
    {
      company: 'Fibodata',
      title: 'Analytics Infrastructure',
      period: { start: '2015-01', end: '2017-01' },
      description: 'Pre-computation-based analytics engine.',
      highlights: ['Supported analytics over 50B+ records'],
      technologies: ['analytics', 'data engineering'],
    },
  ];
  resume.education = [
    {
      institution: 'Jinan University',
      degree: "Dual Bachelor's Degrees",
      field: 'Applied Physics and Finance',
      period: { start: '2009-09', end: '2013-06' },
    },
  ];
  resume.skills = {
    technical: ['Agent Runtime', 'OpenClaw', 'payout orchestration', 'rate limiting',
      'observability', 'sharding', 'full-text search', 'RTB', 'DSP'],
    domain: ['international payments', 'ad delivery', 'private-domain marketing',
      'growth systems', 'AI Agent Infra'],
    soft: ['engineering leadership', 'team management'],
    certifications: [],
  };
  resume.projects = [
    {
      name: 'OpenClaw Runtime Contributions',
      role: 'Contributor',
      description: 'Source-level fixes for real OpenClaw issues.',
      technologies: ['OpenClaw', 'TypeScript'],
      url: 'https://github.com/jnuyao',
    },
  ];
  resume._meta.confidence = 0.88;
  return resume;
}

describe('Schema Validator', () => {
  test('should pass for yaohom resume', () => {
    const resume = buildYaohomResume();
    const result = validateSchema(resume);
    expect(result.valid).toBe(true);
    expect(result.issues.filter(i => i.severity === 'error')).toHaveLength(0);
  });

  test('should fail for missing name', () => {
    const resume = buildYaohomResume();
    resume.identity.name = '';
    const result = validateSchema(resume);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.field === 'identity.name')).toBe(true);
  });

  test('should fail for empty resume', () => {
    const resume = createEmptyResume('url');
    resume.identity.name = 'Test';
    const result = validateSchema(resume);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.field === 'content')).toBe(true);
  });

  test('should warn on missing experience fields', () => {
    const resume = buildYaohomResume();
    resume.experience[0].company = '';
    const result = validateSchema(resume);
    expect(result.valid).toBe(true); // warnings don't invalidate
    expect(result.issues.some(i =>
      i.field.includes('company') && i.severity === 'warning'
    )).toBe(true);
  });
});

describe('Semantic Validator', () => {
  test('should find no critical issues for yaohom resume', () => {
    const resume = buildYaohomResume();
    const result = validateSemantics(resume);
    const warnings = result.issues.filter(i => i.severity === 'warning');
    // May have orphan skills info, but no date issues
    const dateWarnings = warnings.filter(i => i.field.includes('period'));
    expect(dateWarnings).toHaveLength(0);
  });

  test('should detect overlapping experience', () => {
    const resume = buildYaohomResume();
    // Make first two experiences overlap significantly
    resume.experience[0].period = { start: '2022-01', end: '2024-01' };
    resume.experience[1].period = { start: '2021-09', end: '2023-06' };
    const result = validateSemantics(resume);
    const overlapWarnings = result.issues.filter(i =>
      i.message.toLowerCase().includes('overlap')
    );
    expect(overlapWarnings.length).toBeGreaterThan(0);
  });

  test('should detect negative duration', () => {
    const resume = buildYaohomResume();
    resume.experience[3].period = { start: '2020-01', end: '2015-01' };
    const result = validateSemantics(resume);
    const durationWarnings = result.issues.filter(i =>
      i.message.toLowerCase().includes('before start')
    );
    expect(durationWarnings.length).toBeGreaterThan(0);
  });

  test('should flag orphan skills', () => {
    const resume = buildYaohomResume();
    resume.skills.technical.push('Kubernetes', 'Terraform', 'Rust');
    const result = validateSemantics(resume);
    const orphanInfo = result.issues.filter(i =>
      i.message.toLowerCase().includes('not mentioned')
    );
    expect(orphanInfo.length).toBeGreaterThan(0);
  });
});

describe('Confidence Scorer', () => {
  test('should score yaohom resume above 70%', () => {
    const resume = buildYaohomResume();
    const result = scoreConfidence(resume);
    expect(result.overall).toBeGreaterThan(0.70);
  });

  test('should have high name confidence', () => {
    const resume = buildYaohomResume();
    const result = scoreConfidence(resume);
    expect(result.fields['identity.name']).toBeGreaterThan(0.90);
  });

  test('should have high experience confidence', () => {
    const resume = buildYaohomResume();
    const result = scoreConfidence(resume);
    expect(result.fields['experience']).toBeGreaterThan(0.70);
  });

  test('should penalize URL format', () => {
    const resume = buildYaohomResume();
    resume._meta.source_format = 'url';
    const urlScore = scoreConfidence(resume).overall;

    resume._meta.source_format = 'json_resume';
    const jsonScore = scoreConfidence(resume).overall;

    expect(jsonScore).toBeGreaterThan(urlScore);
  });

  test('should score empty resume low', () => {
    const resume = createEmptyResume('url');
    resume.identity.name = 'Test';
    resume._meta.confidence = 0.30;
    const result = scoreConfidence(resume);
    expect(result.overall).toBeLessThan(0.40);
  });
});
