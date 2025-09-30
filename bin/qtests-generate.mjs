#!/usr/bin/env node

// qtests-generate: Node-native CLI (no external runtime) that invokes the compiled TestGenerator
// Implementation mirrors the TypeScript CLI but imports from compiled JS in dist/

// NOTE: This CLI is also responsible for ALWAYS creating/overwriting
// the client project's qtests-runner.mjs at the project root, so that
// client apps consistently get a stable runner without any extra flags.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

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
    withRouter: false,
    yes: false,
    noInteractive: false,
    autoInstall: false
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
      case '--yes':
      case '-y':
        options.yes = true;
        options.noInteractive = true;
        break;
      case '--no-interactive':
        options.noInteractive = true;
        break;
      case '--auto-install':
        options.autoInstall = true;
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
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    console.log(`qtests v${pkg.version}`);
  } catch {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
      console.log(`qtests v${pkg.version || 'unknown'}`);
    } catch {
      console.log('qtests');
    }
  }
}

// Utility: parse env truthy values ('1'|'true'|'yes')
function isEnvTruthy(name) {
  const v = process.env[name];
  if (!v) return false;
  const s = String(v).trim().toLowerCase();
  return s === '1' || s === 'true' || s === 'yes';
}

// Utility: safe exists
function exists(p) {
  try { return fs.existsSync(p); } catch { return false; }
}

// Utility: read file
function read(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return null; }
}

// Decide client project root: prefer npm's INIT_CWD if present and sensible
function resolveClientRoot() {
  const icwd = process.env.INIT_CWD && String(process.env.INIT_CWD).trim();
  if (icwd && exists(icwd) && !icwd.includes(`${path.sep}node_modules${path.sep}`)) return icwd;
  return process.cwd();
}

// Resolve this module's root (node_modules/qtests or repo root during dev)
function resolveModuleRoot() {
  // __dirname of this file is .../qtests/bin
  const thisFile = fileURLToPath(import.meta.url);
  const binDir = path.dirname(thisFile);
  return path.resolve(binDir, '..');
}

// Validate runner template content to avoid writing wrong files
function isValidRunnerTemplate(content) {
  try {
    if (!content) return false;
    // Key invariants per Runner Policies
    return /API Mode/.test(content) && /runCLI/.test(content);
  } catch {
    return false;
  }
}

// Compute required dev dependencies based on project type
function computeRequiredDevDeps() {
  const required = new Map();
  // Core Jest + TS + Babel chain used by our Jest config
  required.set('jest', '^29');
  required.set('ts-jest', '^29');
  required.set('typescript', '^5');
  required.set('babel-jest', '^30');
  required.set('@babel/core', '^7');
  required.set('@babel/preset-env', '^7');

  // React detection: add jsdom env if React present
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
    const all = { ...(pkg.dependencies||{}), ...(pkg.devDependencies||{}), ...(pkg.peerDependencies||{}) };
    const isReact = Boolean(all.react || all['@types/react'] || all['react-dom'] || all['@types/react-dom']);
    if (isReact) required.set('jest-environment-jsdom', '^29');
  } catch {}
  return required;
}

// Ensure devDependencies exist in package.json and optionally install
function ensureDevDeps({ autoInstall=false } = {}) {
  const pkgPath = path.join(process.cwd(), 'package.json');
  if (!exists(pkgPath)) {
    console.log('⚠️  No package.json found; skipping devDependencies setup');
    return { installed: false, toInstall: [] };
  }
  let pkg;
  try { pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')); } catch {
    console.log('⚠️  Could not read package.json; skipping devDependencies setup');
    return { installed: false, toInstall: [] };
  }
  pkg.devDependencies = pkg.devDependencies || {};
  const need = [];
  for (const [name, ver] of computeRequiredDevDeps()) {
    if (!pkg.devDependencies[name] && !(pkg.dependencies && pkg.dependencies[name])) {
      pkg.devDependencies[name] = ver;
      need.push(name);
    }
  }
  if (need.length) {
    try {
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
      console.log(`✅ Updated package.json devDependencies: ${need.join(', ')}`);
    } catch {
      console.log('⚠️  Failed to write updated package.json devDependencies');
    }
  } else {
    console.log('ℹ️ Dev dependencies already satisfied');
  }

  if (autoInstall && need.length) {
    console.log('📦 Installing missing devDependencies...');
    const r = spawnSync('npm', ['install', '-D', ...need], { stdio: 'inherit' });
    if (r.status === 0) {
      console.log('✅ DevDependencies installed');
      return { installed: true, toInstall: [] };
    } else {
      console.log('⚠️  Automatic install failed or was blocked. You can install manually:');
      console.log(`    npm install -D ${need.join(' ')}`);
      return { installed: false, toInstall: need };
    }
  }
  if (!autoInstall && need.length) {
    console.log('💡 Next step: install missing devDependencies:');
    console.log(`    npm install -D ${need.join(' ')}`);
  }
  return { installed: false, toInstall: need };
}

// Obtain runner template content from shipped template or transform fallback
function getRunnerTemplateContent() {
  const moduleRoot = resolveModuleRoot();
  const candidates = [
    path.join(moduleRoot, 'templates', 'qtests-runner.mjs.template'),
    path.join(moduleRoot, 'lib', 'templates', 'qtests-runner.mjs.template')
  ];
  for (const p of candidates) {
    const c = read(p);
    if (c && isValidRunnerTemplate(c)) return c;
  }
  // Fallback: attempt to transform the sacrosanct bin into a standalone runner template
  const binPath = path.join(moduleRoot, 'bin', 'qtests-ts-runner');
  const raw = read(binPath);
  if (raw) {
    const transformed = raw
      .replace(/^#!\/usr\/bin\/env node/m, '#!/usr/bin/env node')
      .replace(/\/\/ IMPORTANT: This CLI is sacrosanct and not generated\. Do not overwrite\./,
        '// GENERATED RUNNER: qtests-runner.mjs - auto-created by qtests TestGenerator\n// Safe to delete; will be recreated as needed.\n// Mirrors bin/qtests-ts-runner behavior (batching, DEBUG_TESTS.md, stable exits).');
    if (isValidRunnerTemplate(transformed)) return transformed;
  }
  return null;
}

// ALWAYS write/overwrite qtests-runner.mjs at client root
function writeRunnerAtClientRoot() {
  const quiet = isEnvTruthy('QTESTS_SILENT');
  const targetRoot = resolveClientRoot();
  const target = path.join(targetRoot, 'qtests-runner.mjs');
  const templateContent = getRunnerTemplateContent();
  if (!templateContent) {
    // Do not fail the generator if template can't be found; just warn once.
    if (!quiet) console.error('qtests: no runner template found; skipped runner write');
    return;
  }
  try {
    fs.writeFileSync(target, templateContent, 'utf8');
    if (!quiet) process.stdout.write('qtests: wrote qtests-runner.mjs at project root (overwritten)\n');
    // Remove legacy runner if present to prevent accidental usage
    try { const legacy = path.join(targetRoot, 'qtests-runner.js'); if (fs.existsSync(legacy)) fs.rmSync(legacy, { force: true }); } catch {}
  } catch (err) {
    // Non-fatal: keep generator usable even if FS writes fail
    if (!quiet) console.error('qtests: failed to write qtests-runner.mjs:', (err && (err.message || err.stack)) || String(err));
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
    // Non-interactive by default; auto-install attempted unless in CI
    if (options.include && options.include.length) console.log(`  Include patterns: ${options.include.join(', ')}`);
    if (options.exclude && options.exclude.length) console.log(`  Exclude patterns: ${options.exclude.join(', ')}`);
    console.log(`  Module system: TypeScript ES Modules (only)`);
    console.log(`  Jest config path: config/jest.config.mjs (auto)\n`);

    // Always scaffold/overwrite the runner at the client root, independent of dry-run
    writeRunnerAtClientRoot();

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

    // Ensure devDependencies and optionally install
    const autoInstallDefault = !isEnvTruthy('CI');
    const { toInstall } = ensureDevDeps({ autoInstall: options.autoInstall || options.yes || options.noInteractive || autoInstallDefault });

    // Actionable next steps
    console.log('\n💡 Next steps:');
    if (results.length > 0) console.log('  • Review generated test files and flesh out assertions');
    console.log('  • Run tests: npm test');
    if (toInstall && toInstall.length) console.log(`  • Install missing devDeps: npm install -D ${toInstall.join(' ')}`);
    console.log('  • Jest config created at config/jest.config.mjs (customize as needed)');
    console.log('  • Scripts updated: pretest (ensure-runner, clean-dist), test (qtests-runner)');
    // Defensive cleanup
    try { const legacy = path.join(process.cwd(), 'qtests-runner.js'); if (fs.existsSync(legacy)) fs.rmSync(legacy, { force: true }); } catch {}
    if (options.mode === 'ast') console.log('  • AST mode enabled: more detailed route and export detection applied');
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
