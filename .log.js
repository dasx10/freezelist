import List from "./index.js";

var test           = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var list           = List(test);
var concated       = list.concat(1);
var slicedConcated = concated.slice(0, -1);
var slicedList     = list.slice(0, -1);

console.dir({
  concated,
  slicedConcated,
  slicedList
});
