// ============================================================
// Unit Tests: URL Resume Parser
// ============================================================

import { UrlResumeParser, UserActionRequired } from '../../src/parsers/url-resume-parser';
import { MockLLMProvider, MinimalMockLLMProvider } from '../helpers/mock-llm-provider';
import { LLMExtractor } from '../../src/extractors/llm-extractor';

describe('UrlResumeParser', () => {
  let mockLlm: MockLLMProvider;
  let extractor: LLMExtractor;
  let parser: UrlResumeParser;

  beforeEach(() => {
    mockLlm = new MockLLMProvider();
    extractor = new LLMExtractor(mockLlm);
    parser = new UrlResumeParser(extractor);
  });

  describe('classifyUrl (via parse behavior)', () => {
    test('should throw UserActionRequired for LinkedIn URLs', async () => {
      try {
        await parser.parse('https://www.linkedin.com/in/someone');
        fail('Should have thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(UserActionRequired);
        expect((err as UserActionRequired).steps.length).toBeGreaterThan(0);
      }
    });

    test('should throw for PDF URLs', async () => {
      await expect(
        parser.parse('https://example.com/resume.pdf')
      ).rejects.toThrow('PDF URL detected');
    });
  });

  describe('pre-rendered content', () => {
    test('should use pre-rendered content when provided', async () => {
      const content = `
        Yaohong Zheng
        AI Agent Infra / Backend Architecture
        10+ years of backend and systems architecture experience.
        Experience:
        - ByteDance, Technical Owner, 2024-Present
        - Tencent Ads, Engineering Lead, 2021-2024
      `;

      const result = await parser.parse('https://yaohom.vercel.app/', content);
      expect(result.identity.name).toBe('Yaohong Zheng');
      expect(result._meta.source_format).toBe('url');
      expect(result._meta.source_file).toBe('https://yaohom.vercel.app/');
      expect(mockLlm.callCount).toBe(1);
    });

    test('should skip pre-rendered content if too short', async () => {
      // Short content should be ignored (falls through to fetch)
      const shortContent = 'Too short';

      // This will fail because we can't actually fetch in tests
      // but it proves the threshold logic works
      await expect(
        parser.parse('https://not-a-real-site.example.com/', shortContent)
      ).rejects.toThrow();
    });
  });

  describe('htmlToText', () => {
    test('should preserve headings as line breaks', () => {
      const html = '<h1>Title</h1><p>Paragraph</p><h2>Subtitle</h2>';
      const text = parser.htmlToText(html);
      expect(text).toContain('Title');
      expect(text).toContain('Paragraph');
      expect(text).toContain('Subtitle');
      // They should be on separate lines
      const lines = text.split('\n').filter(l => l.trim());
      expect(lines.length).toBeGreaterThanOrEqual(3);
    });

    test('should convert list items to bullet points', () => {
      const html = '<ul><li>First item</li><li>Second item</li></ul>';
      const text = parser.htmlToText(html);
      expect(text).toContain('- First item');
      expect(text).toContain('- Second item');
    });

    test('should strip script and style tags', () => {
      const html = '<script>var x = 1;</script><style>.a{color:red}</style><p>Content</p>';
      const text = parser.htmlToText(html);
      expect(text).not.toContain('var x');
      expect(text).not.toContain('color:red');
      expect(text).toContain('Content');
    });

    test('should decode HTML entities', () => {
      const html = '<p>A &amp; B &lt; C &gt; D &quot;E&quot;</p>';
      const text = parser.htmlToText(html);
      expect(text).toContain('A & B < C > D "E"');
    });

    test('should extract href from links', () => {
      const html = '<a href="https://github.com/user">My GitHub</a>';
      const text = parser.htmlToText(html);
      expect(text).toContain('My GitHub');
      expect(text).toContain('https://github.com/user');
    });

    test('should handle SPA shell HTML (minimal content)', () => {
      const spaHtml = `<!DOCTYPE html>
<html><head><title>App</title>
<script src="/static/js/main.js"></script>
</head><body><div id="root"></div>
<script>window.__DATA__={}</script>
</body></html>`;
      const text = parser.htmlToText(spaHtml);
      // Should extract very little meaningful content
      expect(text.length).toBeLessThan(150);
    });

    test('should handle server-rendered HTML (rich content)', () => {
      const ssrHtml = `<!DOCTYPE html>
<html><head><title>Resume</title></head>
<body>
<h1>John Doe</h1>
<p>Senior Software Engineer</p>
<h2>Experience</h2>
<div>
  <h3>Company A</h3>
  <p>2020-2024</p>
  <ul>
    <li>Built microservices</li>
    <li>Led team of 5</li>
  </ul>
</div>
<h2>Education</h2>
<p>MIT, Computer Science, 2016-2020</p>
</body></html>`;
      const text = parser.htmlToText(ssrHtml);
      expect(text.length).toBeGreaterThan(150);
      expect(text).toContain('John Doe');
      expect(text).toContain('Company A');
      expect(text).toContain('- Built microservices');
    });
  });
});
