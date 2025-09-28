// scripts/ci-verify-runner.mjs
// CI check to ensure the repository uses the unified API-only runner and clean dist artifacts.
import fs from 'fs';
import path from 'path';

function fail(msg) { console.error(`CI verify failed: ${msg}`); process.exit(1); }

function readJson(p) { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } }

(function main() {
  const cwd = process.cwd();
  const pkgPath = path.join(cwd, 'package.json');
  const pkg = readJson(pkgPath);
  if (!pkg) fail('package.json not found or invalid JSON');

  // 1) package.json test script must run unified runner
  const testScript = pkg.scripts && pkg.scripts.test;
  if (!testScript || !/qtests-runner\.mjs/.test(testScript)) {
    fail('scripts.test must invoke unified runner: "node qtests-runner.mjs"');
  }
  // 1b) pretest should include ensure-runner and clean-dist
  const pretest = (pkg.scripts && pkg.scripts.pretest) || '';
  if (!/scripts\/ensure-runner\.mjs/.test(pretest) || !/scripts\/clean-dist\.mjs/.test(pretest)) {
    fail('scripts.pretest must include ensure-runner.mjs and clean-dist.mjs');
  }

  // 2) Runner should be API-only and not use tsx or spawn
  const runnerPath = path.join(cwd, 'qtests-runner.mjs');
  if (!fs.existsSync(runnerPath)) fail('qtests-runner.mjs missing at project root');
  const runner = fs.readFileSync(runnerPath, 'utf8');
  if (!/runAllViaAPI\s*\(/.test(runner) || !/runCLI/.test(runner) || !/API Mode/.test(runner)) {
    fail('Runner must be API-only: contain runAllViaAPI(), runCLI usage, and API Mode banner');
  }
  if (/\bspawn\s*\(/.test(runner) || /#!\/usr\/bin\/env\s+tsx/.test(runner) || /\btsx\s+/.test(runner)) {
    fail('Runner must not contain child_process spawn or tsx usage');
  }

  // 3) Dist hygiene: no __mocks__ and no compiled test files in dist/
  const dist = path.join(cwd, 'dist');
  if (fs.existsSync(dist)) {
    const offenders = [];
    const stack = [dist];
    while (stack.length) {
      const dir = stack.pop();
      let ents = [];
      try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { continue; }
      for (const ent of ents) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) {
          if (ent.name === '__mocks__') offenders.push(full);
          stack.push(full);
          continue;
        }
        if (ent.isFile()) {
          if (/\.(test|spec)\.[cm]?jsx?$/.test(ent.name) || /GeneratedTest/.test(ent.name)) offenders.push(full);
        }
      }
    }
    if (offenders.length) {
      console.error('Offending dist artifacts:', offenders);
      fail('dist contains __mocks__ or compiled test files');
    }
  }

  // 4) Jest config includes ignores and require polyfill
  const jestCfgPath = path.join(cwd, 'config', 'jest.config.mjs');
  if (!fs.existsSync(jestCfgPath)) fail('config/jest.config.mjs missing');
  const jestCfg = fs.readFileSync(jestCfgPath, 'utf8');
  if (!/modulePathIgnorePatterns\s*:\s*\[.*dist\/.*/s.test(jestCfg) || !/watchPathIgnorePatterns\s*:\s*\[.*dist\/.*/s.test(jestCfg)) {
    fail('jest.config.mjs must ignore dist/ in modulePathIgnorePatterns and watchPathIgnorePatterns');
  }
  if (!/setupFiles\s*:\s*\[.*jest-require-polyfill\.cjs.*\]/s.test(jestCfg)) {
    fail('jest.config.mjs must include config/jest-require-polyfill.cjs in setupFiles');
  }

  console.log('✅ CI verify: runner and config are compliant.');
})();

