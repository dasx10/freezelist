import List from "./index.js";

console.log("start benchmark");


var size        = 10000;
var lastElement = size - 1;
var iteartions  = 1000;

console.table({
  elements: size,
  iteartions,
});

var testArray            = Array.from({ length: size }, (_, i) => i);
var testList1            = List(testArray);
var testListAppendedSize = testList1.concat(size);

var is             = (next) => Object.defineProperty((value) => value === next, "name", { value: " (is:" + next + ") " });
var isLastElement  = is(lastElement);
var mid            = Math.floor(lastElement / 2);
var isMidElement   = is(mid);
var isFirstElement = is(0);

var results = new Map();
var testCase = (key) => (values, call, description) => {
  var name = [description, call.name, key].join(" ");
  var now  = performance.now();
  values[key](call);
  var time = performance.now() - now;

  var bestKey = "best";
  var slowKey = "slow";
  var avgKey  = "avg";
  var values  = "values";

  if (results.has(name)) {
    var current = results.get(name);
    if (current[bestKey] > time) {
      current[bestKey] = time;
    }

    if (current[slowKey] < time) {
      current[slowKey] = time;
    }
    current[values].push(time);
    current[avgKey] = (current[avgKey] + time) / 2;
    current.total += time;
    return results.set(name, current);
  }
  results.set(name, {
    [bestKey] : time,
    [values]  : [time],
    [slowKey] : time,
    [avgKey]  : time,
    total     : time
  });
};

var findCase          = testCase("find");
var findLastCase      = testCase("findLast");
var findIndexCase     = testCase("findIndex");
var findLastIndexCase = testCase("findLastIndex");
var filterCase        = testCase("filter");
var someCase          = testCase("some");
var everyCase         = testCase("every");

var cases = [
  findCase,
  findLastCase,
  findIndexCase,
  findLastIndexCase,
  filterCase,
  someCase,
  everyCase
];

var uses = [
 isFirstElement,
 isMidElement,
 isLastElement
];

uses.forEach((exec) => {
  var name =  `arr`;
  var i = iteartions;
  while (i--) cases.forEach((test) => test(testArray, exec, name));
});

uses.forEach((exec) => {
  var name =  `list`;
  var i = iteartions;
  while (i--) cases.forEach((test) => test(testList1, exec, name));
});

[(0), (mid), (size - 1)].forEach((value) => {
  var name =  `listN`;
  var i = iteartions;
  while (i--) cases.forEach((test) => test(testList1, is(value), name));
});

uses.forEach((exec) => {
  var name =  `list+size`;
  var i = iteartions;
  while (i--) cases.forEach((test) => test(testListAppendedSize, exec, name));
});

var best  = {}
var avg   = {}
var total = {}
var slow  = {}

results.forEach((result, key) => {
  var name = key.split(" ").at(0);
  if (avg[name]) {
    avg[name]    = (avg[name] + result.avg) / 2;
    total[name] += result.total;
    slow[name]   = Math.min(slow[name], result.slow);
    best[name]   = Math.max(best[name], result.best);
  }
  else {
    avg[name]   = result.avg;
    total[name] = result.total;
    slow[name]  = result.slow;
    best[name]  = result.best;
  }
});

results.forEach((result, key) => results.set(key, JSON.stringify({
  best  : result.best,
  avg   : result.avg,
  total : result.total,
  slow  : result.slow
})));
console.table(Object.fromEntries(results));

console.log("array vs list when always same function");
console.table({
  "average"      : avg["arr"],
  "avg list"     : avg["list"],
  "average diff" : avg["arr"] - avg["list"],
  "total diff"   : total["arr"] - total["list"],
  "slow diff"    : slow["arr"] - slow["list"],
  "best diff"    : best["arr"] - best["list"]
});

console.log("array vs list when always new function");
console.table({
  "average"      : avg["arr"],
  "avg list"     : avg["listN"],
  "average diff" : avg["arr"] - avg["listN"],
  "total diff"   : total["arr"] - total["listN"],
  "slow diff"    : slow["arr"] - slow["listN"],
  "best diff"    : best["arr"] - best["listN"]
});
