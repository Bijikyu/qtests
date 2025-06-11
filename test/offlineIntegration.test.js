const { execFileSync } = require('child_process'); // (import execFileSync for child process)
const path = require('path'); // (path helper)

function runToggleScript(){ // (execute a node script toggling offline mode)
  const script = `
    const offline = require('${path.join(__dirname,'../utils/offlineMode')}');
    const stubAxios = require('${path.join(__dirname,'../stubs/axios')}');
    const realAxios = require(require.resolve('axios'));
    const states = []; 
    offline.setOfflineMode(true);
    states.push({ offline: offline.isOfflineMode(), axiosStub: offline.getAxios() === stubAxios, qType: typeof offline.getQerrors().qerrors });
    offline.setOfflineMode(false);
    states.push({ offline: offline.isOfflineMode(), axiosReal: offline.getAxios() === realAxios, qType: typeof offline.getQerrors().qerrors });
    offline.setOfflineMode(true);
    states.push({ offline: offline.isOfflineMode(), axiosStub: offline.getAxios() === stubAxios, qType: typeof offline.getQerrors().qerrors });
    console.log(JSON.stringify(states));
  `; // (script toggles offline mode and captures results)
  const out = execFileSync(process.execPath, ['-e', script], { env: { NODE_PATH: '' } }).toString(); // (run script)
  const lastLine = out.trim().split('\n').pop(); // (extract JSON line ignoring logs)
  return JSON.parse(lastLine); // (parse child output)
}

test('offlineMode toggles axios and qerrors correctly', () => { // (jest test verifying offlineMode integration)
  const results = runToggleScript(); // (run toggle script)
  const [first, second, third] = results; // (destructure results)
  expect(first.offline).toBe(true); // (initial mode should be offline)
  expect(first.axiosStub).toBe(true); // (axios stub used when offline)
  expect(first.qType).toBe('function'); // (qerrors function present)
  expect(second.offline).toBe(false); // (mode toggled to online)
  expect(second.axiosReal).toBe(true); // (real axios returned when online)
  expect(second.qType).toBe('function'); // (qerrors function still present)
  expect(third.offline).toBe(true); // (mode toggled back to offline)
  expect(third.axiosStub).toBe(true); // (axios stub restored)
  expect(third.qType).toBe('function'); // (qerrors function still present)
});
