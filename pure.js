import memoizeWeak from "./memoizeWeak.js";
var cache = new Map();
export default memoizeWeak((call) => {
  var key = call.toString();
  return cache.has(key) ? cache.get(key) : cache.set(key, call).get(key);
});
