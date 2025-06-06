
/** Method stubbing utility for tests */
function stubMethod(obj, method, replacement) {
  try {
    const orig = obj[method];
    obj[method] = replacement;
    const restore = () => { obj[method] = orig; };
    return restore;
  } catch (error) {
    throw error;
  }
}
module.exports = stubMethod;
