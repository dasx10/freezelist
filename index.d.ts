declare global {
  namespace freezelist {
    interface List<Value> extends ReadonlyArray<Value> {}
  }
}

type ArrayIteratorFunction<Return = unknown, Value = unknown> = (value: Value, index: number, values: readonly Value[]) => Return;

type FlatMap<Return> = Return extends readonly (infer Value)[]
  ? List<Value[]>
  : List<Return[]>
;

interface List<Value> extends freezelist.List<Value> {
}


type ListProxy = <Values extends readonly any[]>(values: Values) => List<Values>;
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
  * testList.splice // undefined
  * testList.sort // undefined
  * testList.reverse // undefined
  *
  * List([]) === List.empty // true
  * ```
  */

type Statics = {
  use           : <Return, Values extends readonly any[]>(call: (...values: Values) => Return) => typeof List;
  empty         : readonly [];

  findIndex     : <Value>(call: ArrayIteratorFunction<any, Value>) => (values: readonly Value[]) => number;
  findLastIndex : <Value>(call: ArrayIteratorFunction<any, Value>) => (values: readonly Value[]) => number;
  some          : <Value>(call: ArrayIteratorFunction<any, Value>) => (values: readonly Value[]) => boolean;
  every         : <Value>(call: ArrayIteratorFunction<any, Value>) => (values: readonly Value[]) => boolean;
  find          : <Value>(call: ArrayIteratorFunction<any, Value>) => (values: readonly Value[]) => Value | undefined;
  findLast      : <Value>(call: ArrayIteratorFunction<any, Value>) => (values: readonly Value[]) => Value | undefined;
  filter        : <Value>(call: ArrayIteratorFunction<any, Value>) => (values: readonly Value[]) => List<Value[]>;
  map           : <Return, Value>(call: ArrayIteratorFunction<Return, Value>) => (values: readonly Value[]) => List<Return[]>;
  flatMap       : <Return ,Value>(call: ArrayIteratorFunction<Return, Value>) => (values: readonly Value[]) => FlatMap<Return>;
  toReversed    : () => <Values extends readonly any[]>(values: Values) => List<Values[number][]>;
  toSorted      : <Value>(call: ArrayIteratorFunction<Value>) => (values: readonly Value[]) => List<Value[]>;
  concat        : <Values extends readonly any[]>(...values: Values) => <Value extends readonly any[]>(value: Value) => List<[...Value, ...FlatMap<Values>]>;
  slice         : <Value>(start: number, end?: number) => (values: readonly Value[]) => List<Value[]>;
  length: 1
}

type MethodsToStatic<Value extends Record<string, any>> = {
  readonly [Key in keyof Value]: (...values: Parameters<Value[Key]>) => <Element>(value: readonly Element[]) => ReturnType<Value[Key]>
};

declare const List: ListProxy & MethodsToStatic<Extract<Omit<List<any>, keyof Statics>, Record<any, (...values: any[]) => any>>> & Statics;
export default List;
