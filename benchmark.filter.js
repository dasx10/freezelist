import List from "./index.js";
import memoize from "./memoize.js";


(() => {

var createArray = (length) => Array.from({ length }, (_, i) => i);
var gt          = (next) => Object.defineProperty((value) => value > next, "name", { value: " (is:" + next + ") " });
var gtMemo      = memoize((value) => gt(value));

var iterations = 10;

var testArray = createArray(1000);
var testList1 = List(testArray);

var end   = testList1.length;
var start = 0;

var next  = createArray(10000);
while (iterations--) {
  testList1 = testList1.slice(start, end);
  testArray = testArray.slice(start, end);

  if (iterations % 4 === 0) {
    testList1 = testList1.concat(next);
    testArray = testArray.concat(next);
  }

  switch (iterations % 3) {
    case 0: {
      start += 10;
    }
    case 1: {
      end -= 10;
    }
    case 2: {
      start += 10;
      end   -= 10;
    }
  }
}

var method = "filter";

  var test = (values, call, name) => {
    var total = 0;
    var length = testArray.length;
    var step = length / 4;
    var end = step;
    while ((end += step) < length) {
      testArray.slice(0, end).forEach(value => {
        var exec = call(value);
        var now  = performance.now();
        values[method](exec);
        var time = performance.now() - now;
        total += time;
      });
    }
    console.log(name, total);
  }

  test(testArray, gt, "array");
  test(testList1, gtMemo, "list 1");
  test(testList1, gtMemo, "list 2");
})()
