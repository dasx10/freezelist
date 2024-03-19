/**
  * @function
  * @name memo
  * @param {Function} call
  * @returns {Function}
  * @example
  * ```
  * var add = (y) => (x) => x + y;
  * var addMemo = memo(add);
  * addMemo === memo(add) // true
  * addMemo(1)(2) // 3
  * addMemo(1) === addMemo(1) // true
  * addMemo(1) === addMemo(2) // false
  * ```
  */
export default function memo<Call extends (value: any) => any>(call: Call): Call;
