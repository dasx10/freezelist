/**
  * @function
  * @name always
  * @param {Value} value
  * @returns {() => Value}
  * @example
  * ```
  * var T = always(true);
  *
  * T() // true
  * T(false) // true
  * T(true) // true
  *
  * var F = always(false);
  *
  * F() // false
  * F(false) // false
  * F(true) // false
  * ```
  */
export default function always<Value>(value: Value): () => Value;
