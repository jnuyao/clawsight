// ============================================================
// URL Resume Parser
// Handles: GitHub profiles, personal websites, PDF URLs.
// LinkedIn → guides user to export (anti-scraping).
//
// v0.1.1: Added SPA detection, improved HTML→text, content input
// ============================================================

import { CanonicalResume, createEmptyResume, Project } from '../schemas/canonical-resume';
import { LLMExtractor } from '../extractors/llm-extractor';
import { uniqueNormalized } from '../utils/text-utils';

export class UserActionRequired extends Error {
  steps: string[];
  fallback?: string;

  constructor(opts: { message: string; steps: string[]; fallback?: string }) {
    super(opts.message);
    this.name = 'UserActionRequired';
    this.steps = opts.steps;
    this.fallback = opts.fallback;
  }
}

type UrlType = 'linkedin' | 'github' | 'pdf_url' | 'personal_site' | 'generic';

/**
 * Minimum characters of extracted text to consider a page
 * "successfully rendered". Below this → likely an SPA shell.
 */
const SPA_DETECTION_THRESHOLD = 150;

export class UrlResumeParser {
  private llmExtractor: LLMExtractor;

  constructor(llmExtractor: LLMExtractor) {
    this.llmExtractor = llmExtractor;
  }

  /**
   * Parse a URL and return a CanonicalResume.
   * @param url  - The URL to parse
   * @param preRenderedContent - Optional: pre-rendered text content (for SPA sites)
   */
  async parse(url: string, preRenderedContent?: string): Promise<CanonicalResume> {
    // If pre-rendered content is provided, skip fetch entirely
    if (preRenderedContent && preRenderedContent.trim().length > SPA_DETECTION_THRESHOLD) {
      return this.extractFromText(preRenderedContent, url);
    }

    const urlType = this.classifyUrl(url);

    switch (urlType) {
      case 'linkedin':
        return this.handleLinkedIn(url);
      case 'github':
        return this.parseGitHubProfile(url);
      case 'pdf_url':
        return this.handlePdfUrl(url);
      case 'personal_site':
      case 'generic':
        return this.parseGenericUrl(url);
    }
  }

  private classifyUrl(url: string): UrlType {
    const lower = url.toLowerCase();
    if (lower.includes('linkedin.com')) return 'linkedin';
    if (lower.includes('github.com')) return 'github';
    if (lower.endsWith('.pdf')) return 'pdf_url';
    return 'personal_site';
  }

  // ---- Extract from pre-rendered or fetched text ----

  private async extractFromText(text: string, sourceUrl: string): Promise<CanonicalResume> {
    const resume = await this.llmExtractor.extractResume(text);
    resume._meta.source_format = 'url';
    resume._meta.source_file = sourceUrl;
    resume._meta.confidence = Math.min(resume._meta.confidence, 0.80);
    return resume;
  }

  // ---- LinkedIn: Don't scrape, guide export ----

  private async handleLinkedIn(_url: string): Promise<never> {
    throw new UserActionRequired({
      message:
        'LinkedIn profiles cannot be scraped directly (anti-bot protection + ToS).\n' +
        'Please export your data manually:',
      steps: [
        '1. Go to LinkedIn → Settings & Privacy → Data Privacy',
        '2. Click "Get a copy of your data"',
        '3. Select "Profile" and "Connections"',
        '4. Download the ZIP file when ready',
        '5. Run: /import-resume ./linkedin-export.zip',
      ],
      fallback:
        'Alternatively, open your LinkedIn profile in browser, ' +
        'save as PDF, then run: /import-resume ./linkedin-profile.pdf',
    });
  }

  // ---- GitHub: Use REST API ----

  async parseGitHubProfile(url: string): Promise<CanonicalResume> {
    const username = this.extractGitHubUsername(url);
    if (!username) {
      throw new Error(`Could not extract GitHub username from URL: ${url}`);
    }

    // Fetch profile, repos, and README in parallel
    const [profile, repos, readme] = await Promise.all([
      this.fetchGitHubApi(`/users/${username}`),
      this.fetchGitHubApi(`/users/${username}/repos?sort=stars&per_page=20`),
      this.fetchGitHubReadme(username),
    ]);

    const resume = createEmptyResume('url', url);

    // Identity from profile
    resume.identity = {
      name: profile.name || username,
      headline: profile.bio || undefined,
      location: profile.location || undefined,
      contact: {
        github: url,
        website: profile.blog || undefined,
      },
    };

    // Infer tech stack from repo languages
    const techStack = this.inferTechStack(repos);
    resume.skills = {
      technical: techStack,
      domain: [],
      soft: [],
      certifications: [],
    };

    // Top repos as projects
    resume.projects = repos
      .filter((r: any) => !r.fork)
      .slice(0, 10)
      .map((r: any): Project => ({
        name: r.name,
        role: 'Creator/Maintainer',
        description: r.description || '',
        technologies: [r.language].filter(Boolean),
        url: r.html_url,
      }));

    // If user has a profile README, extract additional info via LLM
    if (readme) {
      try {
        const additionalInfo = await this.llmExtractor.extractResume(
          `GitHub Profile README for ${username}:\n\n${readme}`
        );
        // Merge additional info (README might have self-intro, skills, etc.)
        if (additionalInfo.identity.headline && !resume.identity.headline) {
          resume.identity.headline = additionalInfo.identity.headline;
        }
        resume.skills.technical = uniqueNormalized([
          ...resume.skills.technical,
          ...additionalInfo.skills.technical,
        ]);
        resume.skills.domain = uniqueNormalized([
          ...resume.skills.domain,
          ...additionalInfo.skills.domain,
        ]);
      } catch {
        // README extraction is best-effort
      }
    }

    resume._meta.confidence = 0.70; // GitHub has limited career info
    resume._meta.field_confidence = {
      'identity.name': profile.name ? 0.95 : 0.5,
      'skills.technical': techStack.length > 0 ? 0.85 : 0.3,
      'projects': repos.length > 0 ? 0.90 : 0,
    };

    return resume;
  }

  // ---- Generic URL: Fetch + SPA detection + LLM extract ----

  private async parseGenericUrl(url: string): Promise<CanonicalResume> {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ClawLifeImport/0.1 (resume-parser)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const text = this.htmlToText(html);

    // SPA Detection: if extracted text is too short, the page likely
    // requires JavaScript rendering (React, Vue, Next.js CSR, etc.)
    if (text.length < SPA_DETECTION_THRESHOLD) {
      throw new UserActionRequired({
        message:
          `The page at ${url} appears to be a JavaScript-rendered site (SPA).\n` +
          `Only ${text.length} characters of content could be extracted from the raw HTML.\n` +
          `The resume content is rendered client-side and cannot be fetched directly.`,
        steps: [
          '1. Open the page in your browser',
          '2. Select all text (Ctrl/Cmd+A) and copy (Ctrl/Cmd+C)',
          '3. Save to a text file: resume.txt',
          '4. Run: /import-resume ./resume.txt',
          '',
          'Or use the --content flag to pipe content directly:',
          '  /import-resume --content "$(pbpaste)" --source-url ' + url,
        ],
        fallback:
          'If the site has a PDF download option, use that instead:\n' +
          '  /import-resume ./downloaded-resume.pdf',
      });
    }

    return this.extractFromText(text, url);
  }

  // ---- PDF URL: Download and hand off ----

  private async handlePdfUrl(url: string): Promise<CanonicalResume> {
    throw new Error(
      `PDF URL detected: ${url}\n` +
      `Please download the file first, then use:\n` +
      `  /import-resume ./downloaded-resume.pdf`
    );
  }

  // ---- Helpers ----

  private extractGitHubUsername(url: string): string | null {
    const match = url.match(/github\.com\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }

  private async fetchGitHubApi(endpoint: string): Promise<any> {
    const response = await fetch(`https://api.github.com${endpoint}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ClawLifeImport/0.1',
        ...(process.env.GITHUB_TOKEN
          ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json();
  }

  private async fetchGitHubReadme(username: string): Promise<string | null> {
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/${username}/${username}/main/README.md`,
        { signal: AbortSignal.timeout(5000) }
      );
      if (response.ok) return response.text();

      // Try master branch
      const response2 = await fetch(
        `https://raw.githubusercontent.com/${username}/${username}/master/README.md`,
        { signal: AbortSignal.timeout(5000) }
      );
      return response2.ok ? response2.text() : null;
    } catch {
      return null;
    }
  }

  private inferTechStack(repos: any[]): string[] {
    const langCount: Record<string, number> = {};
    for (const repo of repos) {
      if (repo.language) {
        langCount[repo.language] = (langCount[repo.language] || 0) + (repo.stargazers_count || 1);
      }
    }
    return Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .map(([lang]) => lang)
      .slice(0, 15);
  }

  /**
   * Improved HTML → text conversion.
   * Preserves document structure (headings, lists, paragraphs)
   * instead of blindly stripping all tags.
   */
  htmlToText(html: string): string {
    let text = html;

    // Remove non-content elements
    text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    text = text.replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '');
    text = text.replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '');
    text = text.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
    text = text.replace(/<!--[\s\S]*?-->/g, '');

    // Structural tags → line breaks
    text = text.replace(/<\/?(h[1-6]|p|div|section|article|header|footer|main|nav|aside|blockquote|pre|ul|ol|table|tr)[^>]*>/gi, '\n');
    text = text.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<hr\s*\/?>/gi, '\n---\n');

    // List items → bullet points
    text = text.replace(/<li[^>]*>/gi, '\n- ');
    text = text.replace(/<\/li>/gi, '');

    // Table cells → tab separation
    text = text.replace(/<td[^>]*>/gi, '\t');
    text = text.replace(/<th[^>]*>/gi, '\t');

    // Extract href from links (preserve URL info)
    text = text.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '$2 ($1)');

    // Strip remaining tags
    text = text.replace(/<[^>]+>/g, '');

    // Decode HTML entities
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&quot;/g, '"');
    text = text.replace(/&#39;/g, "'");
    text = text.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
    text = text.replace(/&#(\d+);/g, (_, dec) =>
      String.fromCharCode(parseInt(dec))
    );

    // Normalize whitespace (preserve line breaks)
    text = text.replace(/[ \t]+/g, ' ');        // collapse horizontal space
    text = text.replace(/\n[ \t]+/g, '\n');       // trim leading space on lines
    text = text.replace(/[ \t]+\n/g, '\n');       // trim trailing space on lines
    text = text.replace(/\n{3,}/g, '\n\n');       // max 2 consecutive newlines

    return text.trim();
  }
}
