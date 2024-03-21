import List from "freezelist";

var i = 10;
var gt = (value) => value > 10000000;
var diff = (a, b) => a - b;
var exec = diff;
var arr = Array.from({ length: 10000 }, (_, i) => Math.random() * 100000);
var list = List(arr);
var method = "toSorted";
var arrays = [];
var list1 = [];
var list2 = [];
var now = 0;
var time = 0;

var sum = values => values.reduce((a, b) => a + b, 0);

while (i--) {
  now = performance.now();
  arr[method](exec);
  time = performance.now() - now;
  arrays.push(time);

  now = performance.now();
  list[method](exec);
  time = performance.now() - now;
  list1.push(time);

  now = performance.now();
  list[method](exec);
  time = performance.now() - now;
  list2.push(time);

  arr = arr.concat(arr)
  list = list.concat(list)

  console.group(method + " " + i);
  console.log("array", sum(arrays));
  console.log("list1", sum(list1));
  console.log("list2", sum(list2));
  console.groupEnd();
}
