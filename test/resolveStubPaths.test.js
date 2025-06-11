const { execFileSync } = require('child_process'); // spawn child node to avoid jest resolver
const path = require('path'); // path for stub locations

test('require.resolve returns stub files with extension', () => { // verify stub path resolution
  console.log(`resolveStubPathTest is running with none`); // start log per guidelines
  const script = `
    require('${path.join(__dirname, '../setup')}');
    const axiosPath = require.resolve('axios');
    const winstonPath = require.resolve('winston');
    console.log(JSON.stringify({ axiosPath, winstonPath }));
  `; // inline script executed with node
  const out = execFileSync(process.execPath, ['-e', script], { env: { NODE_PATH: '' } }).toString(); // run child script
  const result = JSON.parse(out.trim().split('\n').pop()); // parse printed JSON
  const expectedAxios = path.join(__dirname, '../stubs/axios.js'); // expected absolute axios stub path
  const expectedWinston = path.join(__dirname, '../stubs/winston.js'); // expected absolute winston stub path
  expect(result.axiosPath).toBe(expectedAxios); // axios should resolve to stub file
  expect(result.winstonPath).toBe(expectedWinston); // winston should resolve to stub file
  console.log(`resolveStubPathTest has run resulting in pass`); // end log per guidelines
});
