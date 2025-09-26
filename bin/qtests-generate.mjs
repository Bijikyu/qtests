#!/usr/bin/env node

// qtests-generate: Node-native CLI (no tsx) that invokes the compiled TestGenerator
// Implementation mirrors the TypeScript CLI but imports from compiled JS in dist/

import { readFileSync } from 'fs';
import path from 'path';

// Parse command line arguments
function parseArgs(argv) {
  const args = argv.slice(2);
  const options = {
    mode: 'heuristic',
    unit: false,
    integration: false,
    dryRun: false,
    force: false,
    include: [],
    exclude: [],
    react: false,
    skipReactComponents: true,
    updatePackageScript: false,
    withRouter: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--src':
      case '-s':
        options.SRC_DIR = args[++i];
        break;
      case '--test-dir':
      case '-t':
        options.TEST_DIR = args[++i];
        break;
      case '--mode': {
        const mode = args[++i];
        if (!['heuristic', 'ast'].includes(mode)) {
          console.error(`Invalid mode: ${mode}. Use 'heuristic' or 'ast'`);
          process.exit(1);
        }
        options.mode = mode;
        break;
      }
      case '--unit':
        options.unit = true;
        break;
      case '--integration':
        options.integration = true;
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--force':
        options.force = true;
        break;
      case '--react':
        options.react = true;
        break;
      case '--react-components':
        options.skipReactComponents = false;
        break;
      case '--no-react-components':
        options.skipReactComponents = true;
        break;
      case '--update-pkg-script':
        options.updatePackageScript = true;
        break;
      case '--with-router':
        options.withRouter = true;
        break;
      case '--migrate-generated-tests':
        options.migrateGeneratedTests = true;
        break;
      case '--include':
        options.include.push(args[++i]);
        break;
      case '--exclude':
        options.exclude.push(args[++i]);
        break;
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
        break;
      case '--version':
      case '-v':
        showVersion();
        process.exit(0);
        break;
      default:
        if (arg.startsWith('-')) {
          console.error(`Unknown option: ${arg}`);
          process.exit(1);
        }
    }
  }
  return options;
}

function showHelp() {
  console.log(`
qtests Test Generator (Node ESM)

USAGE:
  qtests-generate [OPTIONS]
  (alias: qtests-ts-generate)

OPTIONS:
  -s, --src <dir>       Source directory to scan (default: .)
  -t, --test-dir <dir>  Generated test directory (default: tests/generated-tests)
      --mode <mode>     Analysis mode: 'heuristic' or 'ast' (default: heuristic)
      --unit            Generate only unit tests
      --integration     Generate only integration tests
      --include <glob>  Include files matching glob (repeatable)
      --exclude <glob>  Exclude files matching glob (repeatable)
      --dry-run         Show planned files without writing
      --force           Allow overwriting generated test files
      --react           Force React template mode (use jsdom, React templates)
      --react-components    Opt-in: generate React component tests (hooks are always supported)
      --no-react-components Skip generating tests for React components (default)
      --with-router     Wrap React tests with MemoryRouter when React Router is detected
      --update-pkg-script  Update package.json test script to use Jest with project config

  -h, --help           Show this help message
  -v, --version        Show version information

EXAMPLES:
  qtests-generate                           # Scan current directory with defaults
  qtests-generate --src lib                 # Scan 'lib' directory instead
  qtests-generate --unit --dry-run          # Preview unit tests only
  qtests-generate --mode ast --force        # Use TypeScript AST analysis, overwrite existing
  qtests-generate --include "**/*.ts"       # Only process TypeScript files
  qtests-generate --exclude "**/demo/**"    # Skip demo directories
`);
}

function showVersion() {
  try {
    const packageJsonPath = path.join(process.cwd(), 'node_modules', 'qtests', 'package.json');
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    console.log(`qtests v${pkg.version}`);
  } catch {
    try {
      const pkg = JSON.parse(readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
      console.log(`qtests v${pkg.version || 'unknown'}`);
    } catch {
      console.log('qtests');
    }
  }
}

async function main() {
  try {
    console.log('🔧 qtests Test Generator (Node ESM)\n');
    const options = parseArgs(process.argv);
    console.log('Configuration:');
    console.log(`  Source directory: ${options.SRC_DIR || '.'}`);
    console.log(`  Test directory: ${options.TEST_DIR || 'tests/generated-tests'}`);
    console.log(`  Analysis mode: ${options.mode}`);
    console.log(`  Scope: ${options.unit ? 'unit only' : options.integration ? 'integration only' : 'both'}`);
    console.log(`  Dry run: ${options.dryRun ? 'yes' : 'no'}`);
    console.log(`  Force overwrite: ${options.force ? 'yes' : 'no'}`);
    console.log(`  Force React mode: ${options.react ? 'yes' : 'no'}`);
    console.log(`  Generate component tests: ${options.skipReactComponents === false ? 'yes' : 'no'}`);
    console.log(`  Update package.json script: ${options.updatePackageScript ? 'yes' : 'no'}`);
    if (options.include && options.include.length) console.log(`  Include patterns: ${options.include.join(', ')}`);
    if (options.exclude && options.exclude.length) console.log(`  Exclude patterns: ${options.exclude.join(', ')}`);
    console.log(`  Module system: TypeScript ES Modules (only)`);
    console.log(`  Jest config path: config/jest.config.mjs (auto)\n`);

    // Import compiled TestGenerator from dist, which is shipped in the published package
    const { TestGenerator } = await import('../dist/lib/testGenerator.js');
    const generator = new TestGenerator(options);

    if (options.dryRun) {
      console.log('🔍 Dry run - showing planned test files...\n');
      await generator.generateTestFiles(true);
    } else {
      await generator.generateTestFiles();
    }

    const results = generator.getResults();
    console.log('\n📊 Generation Summary:');
    const unitTests = results.filter(r => r.type === 'unit').length;
    const apiTests = results.filter(r => r.type === 'api').length;
    console.log(`  Unit tests: ${unitTests}`);
    console.log(`  API tests: ${apiTests}`);
    console.log(`  Total files: ${results.length}`);

    if (results.length > 0) {
      console.log('\n💡 Next steps:');
      console.log('  1. Review generated TypeScript test files');
      console.log('  2. Add specific test implementations');
      console.log('  3. Run tests with: npm test');
      if (options.mode === 'ast') console.log('  4. AST analysis may have generated more detailed test stubs');
    } else {
      console.log('\n✅ All source files already have corresponding tests');
    }
  } catch (error) {
    console.error('❌ Error generating tests:', error && (error.stack || error.message) || String(error));
    process.exit(1);
  }
}

// Run when executed directly
main().catch(err => {
  console.error('❌ Unexpected error:', err && (err.stack || err.message) || String(err));
  process.exit(1);
});

