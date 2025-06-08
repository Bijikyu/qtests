require('../setup'); //activate stub resolution for axios and winston

const { setOfflineMode, isOfflineMode, getAxios, getQerrors } = require('../utils/offlineMode'); //import utilities under test

afterEach(() => setOfflineMode(false)); //ensure offline state reset after each test

test('setOfflineMode toggles offline state', () => { //verify state management
  setOfflineMode(true); //enable offline mode
  expect(isOfflineMode()).toBe(true); //state should be true
  setOfflineMode(false); //disable offline mode
  expect(isOfflineMode()).toBe(false); //state should be false
});

test('getAxios returns stub offline and real online', () => { //verify axios selection
  setOfflineMode(true); //enable offline
  const offlineAxios = getAxios(); //retrieve stub
  expect(offlineAxios).toBe(require('../stubs/axios')); //should equal stub module
  setOfflineMode(false); //switch to online
  const onlineAxios = getAxios(); //retrieve real axios
  expect(onlineAxios).toBe(require('axios')); //should equal real axios
});

test('getQerrors returns stub offline and fallback when module missing', () => { //verify qerrors selection
  setOfflineMode(true); //enable offline
  const offlineQerrors = getQerrors(); //get stub when offline
  expect(typeof offlineQerrors.qerrors).toBe('function'); //stub exposes function
  setOfflineMode(false); //switch to online
  const onlineQerrors = getQerrors(); //should fall back due to missing module
  expect(typeof onlineQerrors.qerrors).toBe('function'); //fallback still exposes function
});
