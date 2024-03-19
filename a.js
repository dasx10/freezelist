import List from "freezelist";

var i = 10;
var gt = (value) => value > 10000000;
var arr = Array.from({ length: 10000 }, (_, i) => i)
var list = List(arr);
while (i--) {
  var now = performance.now();
  arr.find(gt);
  console.log(i, performance.now() - now);

  var now = performance.now();
  list.find(gt);
  console.log(i, performance.now() - now);

  var now = performance.now();
  list.find(gt);
  console.log(i, performance.now() - now);

  arr = arr.concat(arr)
  list = list.concat(list)
}
