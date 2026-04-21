/**
 * Generates demo/favicon.ico from logoqtests.png.
 * Embeds 16x16 and 32x32 sizes for broad browser and OS compatibility.
 * Run with: npm run generate:favicon
 */

import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '..', 'logoqtests.png');
const dest = path.join(__dirname, '..', 'demo', 'favicon.ico');

const buf16 = await sharp(src).resize(16, 16).png().toBuffer();
const buf32 = await sharp(src).resize(32, 32).png().toBuffer();

const icoBuffer = await pngToIco([buf16, buf32]);
fs.writeFileSync(dest, icoBuffer);
console.log(`favicon.ico written to ${dest} (${icoBuffer.length} bytes)`);
