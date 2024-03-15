import { it, describe } from "node:test";
import assert from 'node:assert';

import List from "./index.js";

(() => {
  var length = 1000;
  var createTestArray = (length) => Array.from({ length }, (_, i) => Math.random() * length);
  var testArray       = createTestArray(length);
  var testList        = List(testArray);

  var memoize = (call) => {
    var cache = new Map();
    return (value) => cache.has(value) ? cache.get(value) : cache.set(value, call(value)).get(value);
  }

  var is = (next) => (value) => value === next;
  var isMemo = memoize(is);

  var cases = [
    "find",
    "findLast",
    "findIndex",
    "findLastIndex",
    "filter",
    "some",
    "every",
  ];

 describe("List", () => {
   it("create empty", () => {
     assert.strictEqual(List([]), List.empty);
   });

   cases.forEach((key) => {
     it(key, () => {
       var length   = testList.length;
       for (let index = 0; index < length; index++) {
         var test     = is(index);
         var testMemo = isMemo(index);
         assert.deepStrictEqual(testList[key](test),     testArray[key](test));
         assert.deepStrictEqual(testList[key](testMemo), testArray[key](testMemo));
         assert.deepStrictEqual(testList[key](testMemo), testArray[key](test));
         assert.deepStrictEqual(testList[key](test), testArray[key](testMemo));
       }
     });

     it(`${key} after concat`, () => {
       const array      = createTestArray(10);
       var currentList  = array
       var currentArray = array;
       var testCount    = 0;
       var counts = 10;
       while (testCount < counts) {
         const array  = createTestArray(10);
         currentList  = currentList.concat(array);
         currentArray = currentArray.concat(array);
         var length   = currentList.length;

         for (let index = 0; index < length; index++) {
           var test = isMemo(index);
           assert.deepStrictEqual(currentList[key](test), currentArray[key](test));
         }

         testCount++;
       }
     });

     it(`${key} after concat memo`, () => {
       const array      = createTestArray(10);
       var currentList  = array
       var currentArray = array;
       var testCount    = 0;
       var counts = 10;
       while (testCount < counts) {
         const array  = createTestArray(10);
         currentList  = currentList.concat(array);
         currentArray = currentArray.concat(array);
         var length   = currentList.length;

         for (let index = 0; index < length; index++) {
           var testMemo = isMemo(index);
           assert.deepStrictEqual(currentList[key](testMemo), currentArray[key](testMemo));
         }

         testCount++;
       }
     });

     it(`${key} after concat and slice`, () => {
       const array      = createTestArray(10);
       var currentList  = array
       var currentArray = array;
       var testCount    = 0;
       var counts = 100;
       while (testCount < counts) {
         const array  = createTestArray(10);
         currentList  = currentList.concat(array);
         currentArray = currentArray.concat(array);
         var length   = currentList.length;

         for (let index = 0; index < length; index++) {
           var test = isMemo(index);
           assert.deepStrictEqual(currentList[key](test), currentArray[key](test));
         }


         switch (~(Math.random() * 3)) {
           case -1: {
             var randomEnd = Math.floor(Math.random() * length);
             currentList     = currentList.slice(0, randomEnd);
             currentArray    = currentArray.slice(0, randomEnd);
           }
           case -2: {
             var randomStart = Math.floor(Math.random() * length);
             currentList     = currentList.slice(randomStart);
             currentArray    = currentArray.slice(randomStart);
           }
           case -3: {
             var randomStart = Math.floor(Math.random() * length);
             var randomEnd   = Math.floor(Math.random() * length);
             currentList     = currentList.slice(randomStart, randomEnd);
             currentArray    = currentArray.slice(randomStart, randomEnd);
           }
         }

         testCount++;
       }
     });
   });

   it("return this if element add empty", () => {
     assert.strictEqual(testList.concat(), testList);
     assert.strictEqual(testList.concat([]), testList);
     assert.strictEqual(testList.concat([], []), testList);
     assert.strictEqual(testList.concat([], [], []), testList);
     assert.strictEqual(testList.concat(List.empty), testList);
     assert.strictEqual(testList.concat(List.empty, List.empty), testList);
     assert.strictEqual(testList.concat(List.empty, List.empty, []), testList);
     assert.strictEqual(testList.concat(List([])), testList);
   });

   it("return empty full slice", () => {
     assert.strictEqual(testList.slice(testList.length), List.empty);
   });

   it("return current add and slice", () => {
     assert.strictEqual(testList.concat(1).slice(0, -1), testList);

     var tempArray = [1, 2, 3];
     assert.strictEqual(testList.concat(tempArray).slice(0, -(tempArray.length)), testList);
   });
 });
})()
