type ArrayMutationMethodKey = "push" | "pop" | "shift" | "unshift" | "slice" | "splice" | "sort" | "reverse";

/**
  * @function
  * @name List
  * @description
  * Creates immutable lists from existing arrays or other iterable objects.
  * Supports common list manipulation methods such as concat, filter, find etc.
  * All operations return new instances of the list, preserving immutability.
  * Memorizes past computations when providing the same functions as in previous calls.
  * Uses weak reference memoization.
  * @param {Array} values
  * @returns {Readonly<Array>}
  * @example
  * ```
  * const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  * const testList = List(testArray);
  * const lt10 = (value) => value < 10;
  * const gt10 = (value) => value > 10;
  * testList.filter(lt10) === testList // true
  * testList.concat(testArray) === testList.concat(testArray) // true
  * testList.concat(testArray).slice(testArray.length) === testList // true
  *
  * testList.filter(gt10) === List([]) // true
  *
  * var ge5 = (value) => value >= 5;
  * testList.filter(ge5) === testList.filter((value) => value >= 5) // false
  * testList.filter(ge5) === testList.filter(ge5) // true
  *
  * testList.push // undefined
  * testList.shift // undefined
  * testList.pop // undefined
  * testList.unshift // undefined
  * testList.slice // undefined
  * testList.splice // undefined
  * testList.sort // undefined
  * testList.reverse // undefined
  *
  * List([]) === List.empty // true
  * ```
  */
export default function List<Values extends readonly any[]>(values: Values): Readonly<Exclude<Values, ArrayMutationMethodKey>>;


declare function memoize<Call extends (value: any) => any>(call: Call): Call;
declare function memoizeWeak<Call extends (value: any) => any>(call: Call): Call;

export {
  memoize,
  memoizeWeak,
};
