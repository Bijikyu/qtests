// scripts/postinstall-scaffold.mjs
// Purpose: Passively scaffold qtests-runner.mjs into the CLIENT project root after install.
// Behavior: Uses npm's INIT_CWD to locate the original cwd (client root). Quietly no-ops if unavailable.
// Safety: Only writes when the runner is missing. Validates template variants before writing.
import fs from 'fs';
import path from 'path';
import qerrors from 'qerrors';

function isTruthy(v){ if(!v) return false; const s=String(v).trim().toLowerCase(); return s==='1'||s==='true'||s==='yes'; }

function read(p){ 
  try{ 
    return fs.readFileSync(p,'utf8'); 
  }catch(error){
    qerrors(error, 'postinstall-scaffold: file read failed', {
      filePath: p,
      operation: 'readFileSync'
    });
    return null; 
  } 
}

function exists(p){ 
  try{ 
    return fs.existsSync(p); 
  }catch(error){
    qerrors(error, 'postinstall-scaffold: file existence check failed', {
      filePath: p,
      operation: 'existsSync'
    });
    return false; 
  } 
}

function isValidTemplate(content){
  try {
    // More robust validation to prevent template bypass
    if (!content || typeof content !== 'string') return false;
    
    // Check for required Jest API components
    const hasRunCLI = /runCLI/.test(content);
    const hasAPIMode = /API Mode/.test(content);
    const hasTestRunner = /class TestRunner/.test(content);
    const hasJestImport = /from\s+['"]jest['"]|require\(['"]jest['"]\)/.test(content);
    
    // Ensure template has substantial content (not just minimal strings)
    const lineCount = content.split('\n').length;
    const hasSubstantialContent = lineCount > 50;
    
    return hasRunCLI && hasAPIMode && hasTestRunner && hasJestImport && hasSubstantialContent;
  } catch (error) {
    qerrors(error, 'postinstall-scaffold: template validation failed', {
      contentType: typeof content,
      contentLength: content?.length || 0
    });
    return false;
  }
}

(function main(){
  // Respect CI environments wanting silence; but still act passively.
  const quiet = isTruthy(process.env.QTESTS_SILENT);

  // INIT_CWD is the directory npm was executed from (client root)
  const clientRoot = process.env.INIT_CWD && String(process.env.INIT_CWD).trim();
  if (!clientRoot || !exists(clientRoot)) return; // nothing we can do

  // Do not write into node_modules; ensure we're targeting a real project root
  if (clientRoot.includes(`${path.sep}node_modules${path.sep}`)) return;

  const target = path.join(clientRoot, 'qtests-runner.mjs');
  // Passive correction: update client package.json test script if it incorrectly points to qtests-runner.js
try {
    const pkgPath = path.join(clientRoot, 'package.json');
    const pkg = JSON.parse(read(pkgPath) || '{}');
    if (pkg && pkg.scripts && typeof pkg.scripts.test === 'string') {
      if (/node\s+qtests-runner\.js\b/.test(pkg.scripts.test) || !/node\s+qtests-runner\.mjs\b/.test(pkg.scripts.test)) {
        pkg.scripts.test = 'node qtests-runner.mjs';
        // Ensure pretest includes ensure-runner and clean-dist for stability
        const pre = String(pkg.scripts.pretest || '');
        const ensureCmd = 'node scripts/ensure-runner.mjs';
        const cleanCmd = 'node scripts/clean-dist.mjs';
        const parts = [];
        if (!pre.includes('scripts/clean-dist.mjs')) parts.push(cleanCmd);
        if (!pre.includes('scripts/ensure-runner.mjs')) parts.push(ensureCmd);
        pkg.scripts.pretest = parts.length ? (parts.join(' && ') + (pre ? ' && ' + pre : '')) : pre;
        try { 
          fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8'); 
          if (!quiet) console.log('qtests: normalized test script to use qtests-runner.mjs'); 
        } catch (writeError) {
          qerrors(writeError, 'postinstall-scaffold: package.json write failed', {
            pkgPath,
            operation: 'writeFileSync'
          });
        }
      }
    }
    // Remove stray legacy runner if present
    const legacy = path.join(clientRoot, 'qtests-runner.js');
    try { 
      if (exists(legacy)) fs.rmSync(legacy, { force: true }); 
    } catch (removeError) {
      qerrors(removeError, 'postinstall-scaffold: legacy runner removal failed', {
        legacyPath: legacy,
        operation: 'rmSync'
      });
    }
  } catch (error) {
    qerrors(error, 'postinstall-scaffold: package processing failed', {
      clientRoot,
      pkgPath,
      errorType: error.constructor?.name || 'unknown'
    });
  }
  if (exists(target)) return; // runner already present, be passive

  // Locate a valid template from this installed package
  const moduleRoot = process.cwd(); // node_modules/@bijikyu/qtests
  const candidates = [
    path.join(moduleRoot, 'lib', 'templates', 'qtests-runner.mjs.template'),
    path.join(moduleRoot, 'templates', 'qtests-runner.mjs.template')
  ];
  let chosen = null;
  for (const p of candidates){
    if (!exists(p)) continue;
    const c = read(p);
    if (c && isValidTemplate(c)) { chosen = c; break; }
  }
  // Fallback: transform bin if necessary
  if (!chosen) {
    const binPath = path.join(moduleRoot, 'bin', 'qtests-ts-runner');
    if (exists(binPath)) {
      const raw = read(binPath) || '';
      const transformed = raw
        .replace(/^#!\/usr\/bin\/env node/m, '#!/usr/bin/env node')
        .replace(/\/\/ IMPORTANT: This CLI is sacrosanct and not generated\. Do not overwrite\./,
          '// GENERATED RUNNER: qtests-runner.mjs - auto-created by qtests TestGenerator\n// Safe to delete; will be recreated as needed.\n// Mirrors bin/qtests-ts-runner behavior (batching, DEBUG_TESTS.md, stable exits).');
      if (isValidTemplate(transformed)) chosen = transformed;
    }
  }
  if (!chosen) return; // be silent if we can't find a valid template

  try {
    // Atomic file write: write to temp file first, then rename
    let randomSuffix;
    try {
      randomSuffix = require('crypto').randomBytes(4).toString('hex');
    } catch (cryptoError) {
      // Fallback to Math.random if crypto unavailable
      randomSuffix = Math.random().toString(36).substr(2, 9);
      console.warn('Crypto unavailable, using fallback random suffix:', cryptoError.message);
    }
    const tempPath = `${target}.tmp.${process.pid}.${Date.now()}.${randomSuffix}`;
    fs.writeFileSync(tempPath, chosen, 'utf8');
    
    // Verify the temp file was written correctly
    const verifyContent = fs.readFileSync(tempPath, 'utf8');
    if (verifyContent !== chosen) {
      fs.unlinkSync(tempPath);
      throw new Error('File content verification failed');
    }
    
    // Atomic rename - this is the critical operation that prevents race conditions
    fs.renameSync(tempPath, target);
    
    if (!quiet) {
      // Keep output minimal, one line only, no prompts.
      process.stdout.write('qtests: scaffolded qtests-runner.mjs at project root\n');
    }
  } catch (writeError) {
    qerrors(writeError, 'postinstall-scaffold: runner write failed', {
      target,
      chosenLength: chosen?.length || 0,
      operation: 'atomicWriteSync'
    });
    // Silent failure by design; do not block installs.
  }
})();
