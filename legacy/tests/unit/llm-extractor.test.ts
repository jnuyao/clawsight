// ============================================================
// Unit Tests: LLM Extractor
// ============================================================

import { LLMExtractor } from '../../src/extractors/llm-extractor';
import {
  MockLLMProvider,
  MinimalMockLLMProvider,
  FailingMockLLMProvider,
} from '../helpers/mock-llm-provider';

describe('LLMExtractor', () => {
  test('should extract resume from text using mock LLM', async () => {
    const mockLlm = new MockLLMProvider();
    const extractor = new LLMExtractor(mockLlm);

    const resume = await extractor.extractResume(
      'Some resume text here',
      'url',
      'https://yaohom.vercel.app/'
    );

    expect(resume.identity.name).toBe('Yaohong Zheng');
    expect(resume.experience.length).toBe(4);
    expect(resume.education.length).toBe(1);
    expect(resume.skills.technical.length).toBeGreaterThan(0);
    expect(resume._meta.source_format).toBe('url');
    expect(resume._meta.source_file).toBe('https://yaohom.vercel.app/');
    expect(mockLlm.callCount).toBe(1);
  });

  test('should set correct source format (not hardcoded pdf)', async () => {
    const mockLlm = new MockLLMProvider();
    const extractor = new LLMExtractor(mockLlm);

    const resume = await extractor.extractResume('text', 'url', 'https://example.com');
    expect(resume._meta.source_format).toBe('url');

    const resume2 = await extractor.extractResume('text', 'plain_text', './resume.txt');
    expect(resume2._meta.source_format).toBe('plain_text');
  });

  test('should normalize dates in experience', async () => {
    const mockLlm = new MockLLMProvider();
    const extractor = new LLMExtractor(mockLlm);

    const resume = await extractor.extractResume('text');
    // Current job should have no end date (null → undefined)
    expect(resume.experience[0].period.end).toBeUndefined();
    // Other jobs should have normalized dates
    expect(resume.experience[1].period.start).toBe('2021-09');
    expect(resume.experience[1].period.end).toBe('2024-01');
  });

  test('should handle minimal LLM response', async () => {
    const mockLlm = new MinimalMockLLMProvider();
    const extractor = new LLMExtractor(mockLlm);

    const resume = await extractor.extractResume('empty resume');
    expect(resume.identity.name).toBe('Test User');
    expect(resume.experience).toHaveLength(0);
    expect(resume._meta.confidence).toBe(0.30);
  });

  test('should retry on failure and eventually throw', async () => {
    const mockLlm = new FailingMockLLMProvider();
    const extractor = new LLMExtractor(mockLlm, 1); // only 1 retry

    await expect(
      extractor.extractResume('some text')
    ).rejects.toThrow('LLM extraction failed after 2 attempts');
  });

  test('should truncate long text', async () => {
    const mockLlm = new MockLLMProvider();
    const extractor = new LLMExtractor(mockLlm);

    const longText = 'a'.repeat(40000);
    await extractor.extractResume(longText);

    expect(mockLlm.lastUserPrompt).toContain('[... truncated ...]');
    expect(mockLlm.lastUserPrompt.length).toBeLessThan(31000);
  });

  test('should filter out null/undefined values in arrays', async () => {
    const mockLlm: any = {
      async chat() {
        return {
          identity: { name: 'Test', contact: {} },
          experience: [{
            company: 'Co',
            title: 'Dev',
            start_date: '2020-01',
            highlights: ['Good', null, '', 'Great'],
            technologies: [null, 'Java', undefined, 'Python'],
          }],
          education: [],
          skills: {
            technical: ['JS', null, '', 'TS'],
            domain: [],
            soft: [],
            certifications: [],
          },
          projects: [],
          confidence: 0.80,
        };
      },
    };

    const extractor = new LLMExtractor(mockLlm);
    const resume = await extractor.extractResume('text');

    expect(resume.experience[0].highlights).toEqual(['Good', 'Great']);
    expect(resume.experience[0].technologies).toEqual(['Java', 'Python']);
    expect(resume.skills.technical).toEqual(['JS', 'TS']);
  });
});
