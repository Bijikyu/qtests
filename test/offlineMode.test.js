require('../setup'); //activate stub resolution for axios and winston

const { setOfflineMode, isOfflineMode, getAxios, getQerrors, clearOfflineCache } = require('../utils/offlineMode'); //import utilities under test

afterEach(() => { setOfflineMode(false); clearOfflineCache(); }); //ensure offline state reset; caches cleared for test isolation

test('setOfflineMode toggles offline state', () => { //verify state management
  setOfflineMode(true); //enable offline mode
  expect(isOfflineMode()).toBe(true); //state should be true
  setOfflineMode(false); //disable offline mode
  expect(isOfflineMode()).toBe(false); //state should be false
});

test('getAxios returns stub offline and real online', () => { //verify axios selection
  setOfflineMode(true); //enable offline; cache cleared automatically
  const offlineAxios = getAxios(); //retrieve stub after toggle
  expect(offlineAxios).toBe(require('../stubs/axios')); //should equal stub module
  setOfflineMode(false); //switch to online; cache cleared automatically
  const onlineAxios = getAxios(); //retrieve real axios after toggle
  expect(onlineAxios).toBe(require('axios')); //should equal real axios
});

test('getQerrors returns stub offline and fallback when module missing', () => { //verify qerrors selection
  setOfflineMode(true); //enable offline; cache cleared automatically
  const offlineQerrors = getQerrors(); //get stub when offline
  expect(typeof offlineQerrors.qerrors).toBe('function'); //stub exposes function
  setOfflineMode(false); //switch to online; cache cleared automatically
  const onlineQerrors = getQerrors(); //should fall back due to missing module
  expect(typeof onlineQerrors.qerrors).toBe('function'); //fallback still exposes function
});

test('setOfflineMode automatically clears caches on toggle', () => { //verify automatic cache clearing
  setOfflineMode(true); //start offline
  const axiosFirst = getAxios(); //fetch stub instance
  const qerrorsFirst = getQerrors(); //fetch qerrors stub
  setOfflineMode(false); //toggle to online triggers cache clear automatically
  const axiosSecond = getAxios(); //fetch new axios
  const qerrorsSecond = getQerrors(); //fetch new qerrors
  expect(axiosSecond).not.toBe(axiosFirst); //axios should be different after toggle
  expect(qerrorsSecond).not.toBe(qerrorsFirst); //qerrors should be different after toggle
});
