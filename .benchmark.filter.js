import List from "./index.js";
import memoize from "./memoize.js";


(() => {

var createArray = (length) => Array.from({ length }, (_, i) => i);
var gt          = (next) => Object.defineProperty((value) => value > next, "name", { value: " (is:" + next + ") " });
var gtMemo      = memoize((value) => gt(value));

var iterations = 1000;

var testArray = createArray(10000);
var testList1 = List(testArray);

var end    = testList1.length;
var start  = 0;
var method = "filter";

var totalArray = 0;
var totalList  = 0;

var now = 0;
var call;
while (iterations--) {
  var findValue = iterations % 100;
  call = gtMemo(findValue);

  now = performance.now();
  testArray[method](call);
  totalArray += performance.now() - now;

  now = performance.now();
  testList1[method](call);
  totalList += performance.now() - now;

  if (iterations % 10 === 0) {
    testList1 = testList1.slice(start, end);
    testArray = testArray.slice(start, end);
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

  if (iterations % 4 === 0) {
    var next  = createArray(10000);
    testArray = testArray.concat(next);
    testList1 = testList1.concat(next);
  }

}

console.log("length array", testArray.length);
console.log("length list", testList1.length);

console.log("total array", totalArray);
console.log("total list", totalList);

var test = (values, call, name) => {
  var total = 0;
  var length = testArray.length;
  var step = length / 3;
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


  test(testArray, gtMemo, "array");
  test(testList1, gtMemo, "list 1");
  test(testList1, gtMemo, "list 2");

})();

