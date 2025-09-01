global.reloadCount = (global.reloadCount || 0) + 1; //increment on each load
module.exports = { val: global.reloadCount }; //export current count
