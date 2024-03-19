export default (constructor) => (call) => {
  var cache = new constructor();
  return (value, index, values) => cache.has(value) ? cache.get(value) : cache.set(value, call(value, index, values)).get(value);
}
