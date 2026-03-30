// ============================================================
// Mock LLM Provider for Testing
// Returns realistic structured data based on the yaohom resume
// ============================================================

import { LLMProvider } from '../../src/extractors/llm-extractor';

/**
 * Mock LLM provider that returns a pre-defined extraction result.
 * Simulates what a real LLM would output for the yaohom resume.
 */
export class MockLLMProvider implements LLMProvider {
  public callCount = 0;
  public lastSystemPrompt = '';
  public lastUserPrompt = '';

  async chat(
    systemPrompt: string,
    userPrompt: string
  ): Promise<Record<string, any>> {
    this.callCount++;
    this.lastSystemPrompt = systemPrompt;
    this.lastUserPrompt = userPrompt;

    // Return realistic LLM output for the yaohom resume
    return {
      identity: {
        name: 'Yaohong Zheng',
        headline: 'AI Agent Infra / Agent Runtime / Backend Architecture / Engineering Lead',
        location: null,
        timezone: null,
        contact: {
          email: null,
          phone: null,
          linkedin: null,
          github: 'https://github.com/jnuyao',
          website: 'https://yaohom.vercel.app/',
        },
      },
      experience: [
        {
          company: 'ByteDance',
          title: 'Technical Owner, Payout Dispatch',
          start_date: '2024-02',
          end_date: null,
          description: 'Owned payout dispatch and stability for ByteDance International Payments, taking the unified dispatch capability from 0 to 1 and iterating it in production.',
          highlights: [
            'Built a unified dispatch system from 0 to 1 across SLA peaks, liquidity constraints, large-amount / hold cases, channel maintenance, and real-time unhold scenarios.',
            'Established a reusable framework for prioritization, rate limiting, release / traffic smoothing, and paired it with gray rollout, rollback, observability, alerting, and operating procedures.',
            'Reduced FY25 overall payout average duration from 171 minutes to 105 minutes (-39%), and cut Hyperwallet mid-month payout total duration by 403 minutes (-54%).',
            'Expanded normalized dispatch governance to 48.4% of daily flow (61% channel coverage), and improved CCDC Payin success rate by about 0.5% through SmartRetry validation.',
          ],
          technologies: ['payout orchestration', 'rate limiting', 'gray rollout', 'observability'],
        },
        {
          company: 'Tencent Ads',
          title: 'Engineering and Team Management, Private-domain Marketing Platform',
          start_date: '2021-09',
          end_date: '2024-01',
          description: 'Led engineering and delivery for a private-domain marketing platform supporting merchant conversion funnels across lead acquisition, intent capture, deposits, and order placement.',
          highlights: [
            'Owned team execution across OKRs, base architecture, staffing, release planning, and delivery cadence.',
            'Led storage and computing for billion-scale user-behavior data, online marketing services, and domain-driven architecture.',
            'Built and stabilized systems for sharding, user profiles, full-text search, and marketing automation.',
          ],
          technologies: ['sharding', 'full-text search', 'marketing automation', 'user profiles'],
        },
        {
          company: 'Ant Group / Freshippo',
          title: 'Ad Delivery, Marketing Platforms, and Growth Systems',
          start_date: '2017-12',
          end_date: '2021-09',
          description: 'Worked across Ant Group and Freshippo on DSP, marketing platform, and growth initiatives during periods of rapid business and system growth.',
          highlights: [
            'Built an RTB DSP from 0 to 1 during Alipay\'s rapid growth phase, handling 10B PV per day and sustaining over 100k QPS.',
            'Built marketing capabilities for campaign planning, intelligent product selection, and off-app traffic growth supporting 300k/day off-app traffic.',
            'Built durable experience in high-concurrency architecture, high availability, platform abstraction, and growth-system design.',
          ],
          technologies: ['RTB', 'DSP', 'high-concurrency', 'Taobao ecosystem'],
        },
        {
          company: 'Fibodata',
          title: 'Analytics Infrastructure',
          start_date: '2015-01',
          end_date: '2017-01',
          description: 'Built a pre-computation-based analytics engine while the team scaled from tens of thousands of PV to hundreds of millions of PV.',
          highlights: [
            'Worked on core data engineering and participated in platform architecture evolution.',
            'Collected 1B PV of traffic per day and supported analytics over more than 50B records.',
            'Established data-layer capabilities that were later reused across ads, growth, and marketing systems.',
          ],
          technologies: ['analytics', 'pre-computation', 'data engineering'],
        },
      ],
      education: [
        {
          institution: 'Jinan University',
          degree: "Dual Bachelor's Degrees",
          field: 'Applied Physics and Finance',
          start_date: '2009-09',
          end_date: '2013-06',
          gpa: null,
        },
      ],
      skills: {
        technical: [
          'Agent Runtime', 'OpenClaw', 'payout orchestration', 'rate limiting',
          'gray rollout', 'observability', 'sharding', 'full-text search',
          'marketing automation', 'RTB', 'DSP', 'high-concurrency architecture',
          'data engineering', 'analytics',
        ],
        domain: [
          'international payments', 'ad delivery', 'private-domain marketing',
          'growth systems', 'AI Agent Infra', 'channel integrations',
          'memory architecture', 'multi-agent collaboration',
        ],
        soft: [
          'engineering leadership', 'team management', 'system design',
        ],
        certifications: [],
      },
      projects: [
        {
          name: 'OpenClaw Runtime Contributions',
          role: 'Contributor',
          description: 'Source-level fixes for real OpenClaw issues across Web UI, Usage, Gateway Logs, Feishu integrations, Markdown/rich-text parsing, and group session labeling.',
          technologies: ['OpenClaw', 'TypeScript', 'Agent Runtime'],
          url: 'https://github.com/jnuyao',
        },
        {
          name: 'Channel Plugin Analysis',
          role: 'Author',
          description: 'End-to-end channel plugin and message-path analysis for openclaw-weixin and openclaw-lark plugins.',
          technologies: ['WeChat API', 'Lark API', 'webhook', 'OAuth'],
          url: null,
        },
        {
          name: 'Agent Infrastructure Design',
          role: 'Author',
          description: 'System designs for layered Memory architecture (short-term/long-term/Bridge Policy), observability diagnostics, and multi-agent collaboration hierarchy.',
          technologies: ['Memory architecture', 'observability', 'multi-agent'],
          url: null,
        },
      ],
      confidence: 0.88,
    };
  }
}

/**
 * Mock LLM provider that returns minimal/edge-case data.
 */
export class MinimalMockLLMProvider implements LLMProvider {
  async chat(): Promise<Record<string, any>> {
    return {
      identity: {
        name: 'Test User',
        headline: null,
        location: null,
        contact: {},
      },
      experience: [],
      education: [],
      skills: { technical: [], domain: [], soft: [], certifications: [] },
      projects: [],
      confidence: 0.30,
    };
  }
}

/**
 * Mock LLM provider that always fails.
 */
export class FailingMockLLMProvider implements LLMProvider {
  async chat(): Promise<Record<string, any>> {
    throw new Error('LLM API is unavailable');
  }
}
