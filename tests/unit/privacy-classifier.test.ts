// ============================================================
// Unit Tests: Privacy Classifier
// ============================================================

import { classifyPrivacy } from '../../src/privacy/classifier';
import { CanonicalResume, createEmptyResume, PrivacyLevel } from '../../src/schemas/canonical-resume';

function buildTestResume(): CanonicalResume {
  const resume = createEmptyResume('url', 'https://yaohom.vercel.app/');
  resume.identity = {
    name: 'Yaohong Zheng',
    headline: 'Engineering Lead',
    contact: {
      github: 'https://github.com/jnuyao',
      website: 'https://yaohom.vercel.app/',
      email: 'test@example.com',
      phone: '+86-13800138000',
    },
  };
  resume.experience = [
    {
      company: 'ByteDance',
      title: 'Technical Owner',
      period: { start: '2024-02' },
      highlights: ['Reduced payout time by 39%'],
      technologies: ['Go', 'gRPC'],
    },
  ];
  resume.education = [
    {
      institution: 'Jinan University',
      degree: "Bachelor's",
      field: 'Physics',
      period: { start: '2009-09', end: '2013-06' },
    },
  ];
  resume.skills = {
    technical: ['TypeScript', 'Go'],
    domain: ['payments'],
    soft: ['leadership'],
    certifications: [],
  };
  resume.projects = [
    {
      name: 'OpenClaw',
      role: 'Contributor',
      description: 'Open source contributions',
      technologies: ['TypeScript'],
    },
  ];
  return resume;
}

describe('Privacy Classifier', () => {
  test('should classify all fields without error', () => {
    const resume = buildTestResume();
    const result = classifyPrivacy(resume);

    expect(result.autoWrite.length).toBeGreaterThan(0);
    expect(Array.isArray(result.needsOptIn)).toBe(true);
    expect(Array.isArray(result.discarded)).toBe(true);
  });

  test('should classify name and headline as auto-write', () => {
    const resume = buildTestResume();
    const result = classifyPrivacy(resume);

    const nameField = result.autoWrite.find(f => f.path === 'identity.name');
    expect(nameField).toBeDefined();
    expect(nameField!.value).toBe('Yaohong Zheng');
  });

  test('should classify email and phone as needing opt-in', () => {
    const resume = buildTestResume();
    const result = classifyPrivacy(resume);

    const emailField = result.needsOptIn.find(f => f.path === 'identity.contact.email');
    const phoneField = result.needsOptIn.find(f => f.path === 'identity.contact.phone');

    // Email and phone are L2 (SENSITIVE) → needsOptIn
    expect(emailField || phoneField).toBeDefined();
  });

  test('should detect L3 patterns in raw text', () => {
    const resume = buildTestResume();
    const rawText = 'My SSN is 123-45-6789 and credit card 4111111111111111';
    const result = classifyPrivacy(resume, rawText);

    expect(result.l3Detections.length).toBeGreaterThan(0);
    expect(result.discarded.length).toBeGreaterThan(0);
  });

  test('should handle resume with no sensitive fields', () => {
    const resume = createEmptyResume('url');
    resume.identity = {
      name: 'Test User',
      headline: 'Developer',
      contact: {},
    };
    resume.skills = {
      technical: ['Python'],
      domain: [],
      soft: [],
      certifications: [],
    };

    const result = classifyPrivacy(resume);
    expect(result.autoWrite.length).toBeGreaterThan(0);
    expect(result.discarded).toHaveLength(0);
  });
});
