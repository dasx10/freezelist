var cache = new Map();
export default (call) => {
  var key = call.toString();
  return cache.has(key) ? cache.get(key) : cache.set(key, call).get(key);
}
