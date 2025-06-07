
function logStart(functionName, ...args) {
  console.log(`[START] ${functionName}(${args.map(arg => JSON.stringify(arg)).join(', ')})`);
}

function logReturn(functionName, returnValue) {
  console.log(`[RETURN] ${functionName} -> ${JSON.stringify(returnValue)}`);
}

module.exports = { logStart, logReturn };
