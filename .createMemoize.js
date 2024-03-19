export default (constructor) => (call) => {
  var cache = new constructor();
  return (value) => cache.has(value) ? cache.get(value) : cache.set(value, call(value)).get(value);
}
