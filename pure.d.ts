/**
  * @function
  * @name pure
  * @param {Function} call
  * @returns {Function}
  * @example
  * ```
  * var add = (a, b) => a + b;
  * pure(add)(1, 2) // 3
  * pure(add)(1, 2) // 3
  * pure(add) === pure(add) // true
  *
  * pure((value) => value + 1) === pure((value) => value + 1) // true
  * pure((value) => value + 1) === pure((x) => x + 1) // false
  * ```
  */
export default function pure<Call extends Function>(call: Call): Call;
