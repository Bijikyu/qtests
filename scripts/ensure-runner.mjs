// Ensures qtests-runner.mjs exists at project root by copying the shipped template.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cwd = process.cwd();
function firstExisting(paths){for(const p of paths){try{if(fs.existsSync(p))return p}catch{}}return null}
try{const target=path.join(cwd,'qtests-runner.mjs');if(!fs.existsSync(target)){const candidates=[path.join(cwd,'templates','qtests-runner.mjs.template'),path.join(cwd,'lib','templates','qtests-runner.mjs.template'),path.join(cwd,'node_modules','qtests','templates','qtests-runner.mjs.template'),path.join(cwd,'node_modules','qtests','lib','templates','qtests-runner.mjs.template')];const template=firstExisting(candidates);if(!template){process.stderr.write('ensure-runner: no runner template found; skipped\n');process.exit(0)}const content=fs.readFileSync(template,'utf8');fs.writeFileSync(target,content,'utf8');process.stdout.write('ensure-runner: created qtests-runner.mjs from template\n')}}catch(err){process.stderr.write('ensure-runner error: '+(err&& (err.stack||err.message) || String(err))+'\n');process.exit(0)}
