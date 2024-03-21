import List from "./index.js";

var list = List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  .concat([30, 29, 37, 11, 22, 10, 6])
  .concat([0, -1])
  .concat([0, -2])
;

list[0] = 10;

console.dir({ list }, { depth: 10 })
console.log(list.toSorted((a, b) => a - b));


