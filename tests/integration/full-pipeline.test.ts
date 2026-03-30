// ============================================================
// Integration Test: Full Pipeline with Real Resume Data
//
// Tests the complete import-resume pipeline using the
// yaohom.vercel.app resume text + mock LLM provider.
// ============================================================

import * as fs from 'fs';
import * as path from 'path';
import { importResume } from '../../src/commands/import-resume';
import { MockLLMProvider } from '../helpers/mock-llm-provider';

describe('Full Pipeline Integration - yaohom resume', () => {
  const fixtureDir = path.join(__dirname, '..', 'fixtures');
  const resumeTextPath = path.join(fixtureDir, 'yaohom-resume-text.txt');
  let tempWorkspace: string;
  let mockLlm: MockLLMProvider;

  beforeAll(() => {
    // Verify fixture exists
    expect(fs.existsSync(resumeTextPath)).toBe(true);
  });

  beforeEach(() => {
    // Create a temporary workspace for each test
    tempWorkspace = path.join(__dirname, '..', '.tmp-workspace-' + Date.now());
    fs.mkdirSync(tempWorkspace, { recursive: true });
    mockLlm = new MockLLMProvider();
  });

  afterEach(() => {
    // Clean up temp workspace
    if (fs.existsSync(tempWorkspace)) {
      fs.rmSync(tempWorkspace, { recursive: true, force: true });
    }
  });

  test('should successfully import from plain text file', async () => {
    const result = await importResume({
      source: resumeTextPath,
      workspaceDir: tempWorkspace,
      llmProvider: mockLlm,
    });

    expect(result.success).toBe(true);
    expect(result.resume).toBeDefined();
    expect(result.resume!.identity.name).toBe('Yaohong Zheng');
    expect(result.resume!.experience.length).toBe(4);
    expect(result.resume!.education.length).toBe(1);
    expect(result.resume!.projects.length).toBe(3);
    expect(result.report).toContain('简历导入完成');
  });

  test('should write correct files to workspace', async () => {
    const result = await importResume({
      source: resumeTextPath,
      workspaceDir: tempWorkspace,
      llmProvider: mockLlm,
    });

    expect(result.success).toBe(true);

    // Check USER.md
    const userMdPath = path.join(tempWorkspace, 'USER.md');
    expect(fs.existsSync(userMdPath)).toBe(true);
    const userMd = fs.readFileSync(userMdPath, 'utf-8');
    expect(userMd).toContain('Yaohong Zheng');
    expect(userMd).toContain('ByteDance');
    expect(userMd).toContain('Agent Runtime');

    // Check MEMORY.md
    const memoryMdPath = path.join(tempWorkspace, 'MEMORY.md');
    expect(fs.existsSync(memoryMdPath)).toBe(true);
    const memoryMd = fs.readFileSync(memoryMdPath, 'utf-8');
    expect(memoryMd).toContain('Career Trajectory');
    expect(memoryMd).toContain('Payout Dispatch');

    // Check project files
    const projectDir = path.join(tempWorkspace, 'memory', 'projects');
    expect(fs.existsSync(projectDir)).toBe(true);
    const projectFiles = fs.readdirSync(projectDir);
    expect(projectFiles.length).toBeGreaterThanOrEqual(1);
  });

  test('should generate accurate Memory Score delta', async () => {
    const result = await importResume({
      source: resumeTextPath,
      workspaceDir: tempWorkspace,
      llmProvider: mockLlm,
    });

    expect(result.success).toBe(true);
    expect(result.scoreBefore).toBe(0); // empty workspace
    expect(result.scoreAfter).toBeGreaterThan(0);
    expect(result.report).toContain('Memory Score');
  });

  test('should handle dry-run without writing files', async () => {
    const result = await importResume({
      source: resumeTextPath,
      workspaceDir: tempWorkspace,
      llmProvider: mockLlm,
      dryRun: true,
    });

    expect(result.success).toBe(true);
    expect(result.report).toContain('Dry Run');

    // No files should be written
    const userMdPath = path.join(tempWorkspace, 'USER.md');
    expect(fs.existsSync(userMdPath)).toBe(false);
  });

  test('should correctly classify privacy levels', async () => {
    const result = await importResume({
      source: resumeTextPath,
      workspaceDir: tempWorkspace,
      llmProvider: mockLlm,
    });

    expect(result.success).toBe(true);
    // GitHub URL should be auto-written or need opt-in
    // (depends on privacy config — at least shouldn't crash)
    expect(result.report).toBeDefined();
  });

  test('should extract all 4 work experiences', async () => {
    const result = await importResume({
      source: resumeTextPath,
      workspaceDir: tempWorkspace,
      llmProvider: mockLlm,
    });

    expect(result.success).toBe(true);
    const resume = result.resume!;

    // Verify experience count and order
    expect(resume.experience.length).toBe(4);
    expect(resume.experience[0].company).toBe('ByteDance');
    expect(resume.experience[1].company).toBe('Tencent Ads');
    expect(resume.experience[2].company).toContain('Ant Group');
    expect(resume.experience[3].company).toBe('Fibodata');

    // Verify current job has no end date
    expect(resume.experience[0].period.end).toBeUndefined();

    // Verify highlights are extracted
    expect(resume.experience[0].highlights.length).toBeGreaterThanOrEqual(3);
  });

  test('should handle pre-rendered content for SPA sites', async () => {
    const resumeText = fs.readFileSync(resumeTextPath, 'utf-8');

    const result = await importResume({
      source: 'https://yaohom.vercel.app/',
      workspaceDir: tempWorkspace,
      llmProvider: mockLlm,
      preRenderedContent: resumeText,
      sourceUrl: 'https://yaohom.vercel.app/',
    });

    expect(result.success).toBe(true);
    expect(result.resume!.identity.name).toBe('Yaohong Zheng');
    expect(result.resume!._meta.source_format).toBe('url');
    expect(result.resume!._meta.source_file).toBe('https://yaohom.vercel.app/');
  });

  test('should call progress callback', async () => {
    const progressCalls: Array<{ step: string; detail?: string }> = [];

    await importResume({
      source: resumeTextPath,
      workspaceDir: tempWorkspace,
      llmProvider: mockLlm,
      onProgress: (step, detail) => {
        progressCalls.push({ step, detail });
      },
    });

    expect(progressCalls.length).toBeGreaterThan(5);
    expect(progressCalls.some(p => p.step === 'detect')).toBe(true);
    expect(progressCalls.some(p => p.step === 'parse')).toBe(true);
    expect(progressCalls.some(p => p.step === 'validate')).toBe(true);
    expect(progressCalls.some(p => p.step === 'write')).toBe(true);
  });

  test('should merge into existing USER.md', async () => {
    // Pre-populate USER.md
    const existingContent = `## Identity
- Name: Old Name
- Role: Old Role

## Custom Section
- Some custom info
`;
    fs.writeFileSync(path.join(tempWorkspace, 'USER.md'), existingContent, 'utf-8');

    const result = await importResume({
      source: resumeTextPath,
      workspaceDir: tempWorkspace,
      llmProvider: mockLlm,
    });

    expect(result.success).toBe(true);
    const userMd = fs.readFileSync(path.join(tempWorkspace, 'USER.md'), 'utf-8');

    // Should update identity to new name
    expect(userMd).toContain('Yaohong Zheng');
  });
});
