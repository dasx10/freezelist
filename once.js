export default (call) => {
  var value;
  var is;
  return (next) => is ? value : (is = true, value = call(next));
};
