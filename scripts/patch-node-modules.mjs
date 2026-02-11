import fs from 'fs';
import path from 'path';

const root = process.cwd();

function patchFile(relPath, patches) {
  const fullPath = path.join(root, relPath);
  if (!fs.existsSync(fullPath)) return false;
  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;
  for (const [search, replace] of patches) {
    if (content.includes(search) && !content.includes(replace)) {
      content = content.replace(search, replace);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(fullPath, content, 'utf8');
    return true;
  }
  return false;
}

function writeFileIfNeeded(relPath, content) {
  const fullPath = path.join(root, relPath);
  if (fs.existsSync(fullPath)) {
    const existing = fs.readFileSync(fullPath, 'utf8');
    if (existing === content) return false;
  }
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  return true;
}

let patchCount = 0;

const qerrorsAlias = `// Auto-generated alias to ensure bare 'qerrors' imports resolve to @bijikyu/qerrors
let mod;
try {
  mod = require("@bijikyu/qerrors");
} catch {
  try {
    mod = require(require("path").join(process.cwd(), "dist/lib/qerrorsFallback.js"));
    mod = mod.default || mod;
  } catch {
    mod = (error, message, context) => {
      console.error('[QERRORS]', JSON.stringify({ message: message || error.message, context: context || {} }));
    };
  }
}
module.exports = mod;
`;
if (writeFileIfNeeded('node_modules/qerrors/index.js', qerrorsAlias)) {
  patchCount++;
}
const qerrorsAliasPkg = JSON.stringify({
  name: "qerrors",
  private: true,
  main: "index.js",
  version: "0.0.0-qtests-alias"
}, null, 2) + '\n';
writeFileIfNeeded('node_modules/qerrors/package.json', qerrorsAliasPkg);

if (patchFile('node_modules/@bijikyu/qerrors/index.js', [
  [
    "module.exports.verboseLog = (message) => console.log(`[VERBOSE] ${message}`);",
    "module.exports.verboseLog = (message) => console.log(`[VERBOSE] ${message}`);\n\n// Export qerrors as named export for ESM interop\nmodule.exports.qerrors = qerrors;"
  ]
])) {
  patchCount++;
}

const qgenutilsPkgPath = path.join(root, 'node_modules/@bijikyu/qgenutils/package.json');
if (fs.existsSync(qgenutilsPkgPath)) {
  try {
    const pkg = JSON.parse(fs.readFileSync(qgenutilsPkgPath, 'utf8'));
    let changed = false;
    if (pkg.exports) {
      for (const key of Object.keys(pkg.exports)) {
        const entry = pkg.exports[key];
        if (typeof entry === 'object' && entry.import && !entry.require) {
          entry.require = entry.import;
          entry.default = entry.import;
          changed = true;
        }
      }
    }
    if (changed) {
      fs.writeFileSync(qgenutilsPkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
      patchCount++;
    }
  } catch {}
}

if (patchFile('node_modules/@bijikyu/qgenutils/dist/lib/utilities/security/timingSafeCompare.js', [
  [
    "const safeCompare = require('safe-compare');",
    "import { createRequire } from 'module';\nconst _require = createRequire(import.meta.url);\nconst safeCompare = _require('safe-compare');"
  ]
])) {
  patchCount++;
}

if (patchCount > 0) {
  process.stdout.write(`qtests: applied ${patchCount} node_modules patch(es)\n`);
}
