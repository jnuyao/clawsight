// ============================================================
// claw-life-import — Entry Point
//
// OpenClaw Skill for importing personal data into agent memory.
//
// v0.1.1: Added --content flag, --source-url flag
// ============================================================

// Re-export commands
export { importResume, ImportResumeOptions, ImportResumeResult } from './commands/import-resume';
export { memoryScore, MemoryScoreOptions } from './commands/memory-score';

// Re-export core types
export {
  CanonicalResume,
  SourceFormat,
  PrivacyLevel,
  Experience,
  Education,
  Skills,
  Project,
} from './schemas/canonical-resume';

// Re-export utilities for external use
export { LLMExtractor, LLMProvider } from './extractors/llm-extractor';
export { calculateMemoryScore, MemoryScoreResult } from './scoring/memory-score';
export { classifyPrivacy } from './privacy/classifier';
export { detectFormat } from './parsers/format-detector';

// ============================================================
// CLI Entry Point (when run directly)
// ============================================================

type SourceFormat = import('./schemas/canonical-resume').SourceFormat;

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    printHelp();
    return;
  }

  const command = args[0];

  switch (command) {
    case 'import-resume':
    case '/import-resume': {
      const source = args[1];
      if (!source && !getArgValue(args, '--content')) {
        console.error('Error: Please provide a resume source (file path, URL, or JSON).');
        console.error('Usage: claw-life-import import-resume <source> [--format pdf|json|url] [--dry-run]');
        console.error('       claw-life-import import-resume --content "..." --source-url <url>');
        process.exit(1);
      }

      const { importResume } = await import('./commands/import-resume');

      const format = getArgValue(args, '--format') as SourceFormat | undefined;
      const dryRun = args.includes('--dry-run');
      const workspaceDir = getArgValue(args, '--workspace') || process.cwd();
      const preRenderedContent = getArgValue(args, '--content');
      const sourceUrl = getArgValue(args, '--source-url');

      const effectiveSource = source || sourceUrl || 'stdin';

      console.log(`\n🔄 Importing resume from: ${effectiveSource}\n`);

      // Progress callback for CLI
      const onProgress = (step: string, detail?: string) => {
        const icons: Record<string, string> = {
          score_before: '📊',
          detect: '🔍',
          detect_done: '✅',
          parse: '📄',
          parse_done: '✅',
          validate: '🔎',
          validate_done: '✅',
          privacy: '🔒',
          privacy_done: '✅',
          write: '💾',
          write_done: '✅',
          score_after: '📊',
          report: '📋',
        };
        const icon = icons[step] || '  ';
        if (detail) {
          console.log(`${icon} ${detail}`);
        }
      };

      const result = await importResume({
        source: effectiveSource,
        format,
        dryRun,
        workspaceDir,
        preRenderedContent,
        sourceUrl,
        onProgress,
      });

      console.log('\n' + result.report);

      if (!result.success) {
        process.exit(1);
      }
      break;
    }

    case 'memory-score':
    case '/memory-score': {
      const { memoryScore } = await import('./commands/memory-score');
      const workspaceDir = getArgValue(args, '--workspace') || process.cwd();
      const format = (getArgValue(args, '--format') || 'full') as 'full' | 'compact' | 'json';

      const result = memoryScore({ workspaceDir, format });
      console.log(result.report);
      break;
    }

    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
  }
}

function printHelp() {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║           🧠 claw-life-import v0.1.1                  ║
║   Import personal data to bootstrap Claw memory       ║
╚═══════════════════════════════════════════════════════╝

COMMANDS:

  import-resume <source>     Import a resume into Claw memory
    --format <pdf|json|url>  Force input format (auto-detected by default)
    --dry-run                Preview changes without writing
    --workspace <dir>        OpenClaw workspace directory
    --content <text>         Pre-rendered text content (for SPA sites)
    --source-url <url>       Original URL (used with --content)

  memory-score               Check how well Claw knows you
    --format <full|compact|json>  Output format
    --workspace <dir>             OpenClaw workspace directory

EXAMPLES:

  # Import a PDF resume
  claw-life-import import-resume ./my-resume.pdf

  # Import JSON Resume format
  claw-life-import import-resume ./resume.json

  # Import from GitHub profile
  claw-life-import import-resume https://github.com/username

  # Import from a personal website (SPA workaround)
  claw-life-import import-resume --content "$(cat resume.txt)" --source-url https://example.com

  # Import plain text file (e.g., copied from SPA site)
  claw-life-import import-resume ./resume.txt

  # Dry-run (preview without writing)
  claw-life-import import-resume ./resume.pdf --dry-run

  # Check your memory score
  claw-life-import memory-score
`);
}

function getArgValue(args: string[], flag: string): string | undefined {
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length) {
    return args[idx + 1];
  }
  return undefined;
}

// Run if executed directly
if (require.main === module) {
  main().catch(err => {
    console.error('Fatal error:', err.message || err);
    process.exit(1);
  });
}
