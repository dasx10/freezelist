import memoizeWeak from "./memoizeWeak.js";
var symbol = Symbol();

var Left  = new WeakMap();
var Right = new WeakMap();

var getRight = (context) => Right.get(List(context));
var getLeft  = (context) => Left.get(List(context));
var setRight = (context, value) => Right.set(List(context), value);
var setLeft  = (context, value) => Left.set(List(context), value);

var empty = new Proxy([], {
  get: get,
  set: set,
})

var Cache = new WeakMap();
var getCache = (context) => Cache.get(context) || Cache.set(context, new Map).get(context);

/**
  * @param {Object} context
  * @param {string} name
  * @returns {WeakMap}
  */
var getStore = (context, name) => {
  var map = getCache(context);
  return map.get(name) || map.set(name, new WeakMap).get(name);
}

var saveStore = (context, name, key) => (value) => (getStore(context, name).set(key, value), value);

var isArray        = Array.isArray;
var absIndex       = (index, length) => index < 0 ? 0 : index > length ? length : index;
var normalizeIndex = (index, length) => absIndex(index < 0 ? length + index : index, length);
var orIndex        = (index, call)   => (value, key, values) => index === key || call(value, key, values);

var isIgnoreSlice = (start, end, length) => (start === undefined)
  || (normalizeIndex(start) <= 0) && (end === undefined || normalizeIndex(end) >= length);

var isEmptySlice  = (start, end, length) => (length === 0) || (end === 0) || normalizeIndex(start) >= normalizeIndex(end);

function _findLastIndexTree (call, left, right) {
  var findLastIndexStore = getStore(this, "findLastIndex");
  if (findLastIndexStore.has(call)) return findLastIndexStore.get(call);
  var index = right.findLastIndex(call);
  return saveStore(this, "findLastIndex", call)(index === -1 ? left.findLastIndex(call) : index);
}

function _findIndex (call) {
  var findIndexStore = getStore(this, "findIndex");
  if (findIndexStore.has(call)) return findIndexStore.get(call);

  var findLastIndexStore = getStore(this, "findLastIndex");
  if (findLastIndexStore.has(call)) {
    var index = findLastIndexStore.get(call);
    if (index < 1) return index;
    index = this.findIndex.call(this, orIndex(index, call));
    return saveStore(this, "findIndex", call)(index);
  }

  return saveStore(this, "findIndex", call)(this.findIndex(call));
}

function _findLastIndex (call) {
  var findLastIndexStore = getStore(this, "findLastIndex");
  if (findLastIndexStore.has(call)) return findLastIndexStore.get(call);

  var findIndexStore = getStore(this, "findIndex");
  if (findIndexStore.has(call)) {
    var index = findIndexStore.get(call);
    if (index === -1) return index;
    index = this.findLastIndex.call(this, orIndex(index, call));
    return saveStore(this, "findLastIndex", call)(index);
  }

  return saveStore(this, "findLastIndex", call)(this.findLastIndex(call));
}

function findIndex (call) {
  var findIndexStore = getStore(this, "findIndex");
  if (findIndexStore.has(call)) return findIndexStore.get(call);
  if (call.length < 2) {
    var left = getLeft(this);
    if (left) {
      var index = left.findIndex(call);
      return saveStore(this, "findIndex", call)(index === -1 ? getRight(this).findIndex(call) : index);
    }
  }
  return _findIndex.call(this, call);
}

function findLastIndex (call) {
  var findLastIndexStore = getStore(this, "findLastIndex");
  if (findLastIndexStore.has(call)) return findLastIndexStore.get(call);

  if (call.length < 2) {
    var right = getRight(this);
    if (right) return _findLastIndexTree.call(this, call, getLeft(this), right);
  }

  var findIndexStore = getStore(this, "findIndex");
  if (findIndexStore.has(call)) {
    var index = findIndexStore.get(call);
    if (index === -1) return index;
    index = this.findLastIndex(this, orIndex(index, call));
    return saveStore(this, "findLastIndex", call)(index);
  }

  return saveStore(this, "findLastIndex", call)(this.findLastIndex(call));
}

function find (call) {
  var findStore = getStore(this, "find");
  if (findStore.has(call)) return findStore.get(call);
  return saveStore(this, "find", call)(this[_findIndex.call(this, call)]);
}

function findLast (call) {
  var findLastStore = getStore(this, "findLast");
  if (findLastStore.has(call)) return findLastStore.get(call);
  return saveStore(this, "findLast", call)(this[_findLastIndex.call(this, call)]);
}

function filter (call) {
  var filterStore = getStore(this, "filter");
  if (filterStore.has(call)) return filterStore.get(call);
  var save = saveStore(this, "filter", call);
  if (call.length < 2) {
    var leftIndex = _findIndex.call(this, call);
    if (leftIndex === -1) return save(empty);

    var rightIndex = _findLastIndex.call(this, call);
    if (leftIndex === 0 && rightIndex === this.length - 1) return saveStore(this, "filter", call)(List(this));

    var value = slice.call(this, leftIndex, rightIndex).filter(call);
    return save(List(value.length === this.length ? this : value));
  }

  var value = this.filter(call);
  return save(List(value.length === this.length ? this : value));
}

function map (call) {
  var mapStore = getStore(this, "map");
  if (mapStore.has(call)) return mapStore.get(call);
  if (call.length < 2) {
    var right = getRight(this);
    if (right) {
      var left = getLeft(this);
      return saveStore(this, "map", call)(left.map(call).concat(right.map(call)));
    }
  }
  return saveStore(this, "map", call)(this.map(call));
}

function flatMap (call) {
  var flatMapStore = getStore(this, "flatMap");
  if (flatMapStore.has(call)) return flatMapStore.get(call);
  if (call.length < 2) {
    var right = getRight(this);
    if (right) {
      var left = getLeft(this);
      return saveStore(this, "flatMap", call)(left.flatMap(call).concat(right.flatMap(call)));
    }
  }
  return saveStore(this, "flatMap", call)(this.flatMap(call));
}

function sliceTree (start, end, left, right) {
  var leftLength = left.length;
  if (start === 0) {
    end = normalizeIndex(end, this.length);
    if (end === leftLength) return left;
    if (end < leftLength) return left.slice(end);
    return left.concat(right.slice(0, end - leftLength));
  }

  if (start < 0) start = leftLength + start;

  if (start === leftLength) return end === undefined ? right : right.slice(0, end - leftLength);
  if (start > leftLength) {
    if (end === void 0) return right.slice(start - leftLength);
    if (end < 0) end = this.length + end;
    return right.slice(start - leftLength, end - leftLength);
  }

  if (start < leftLength) {
    if (end === void 0) return left.slice(start);
    if (end < 0) end = this.length + end;
    return left.slice(start).concat(right.slice(0, end - leftLength));
  }

  return [];
}

function slice (start, end) {
  var length = this.length;
  if (isIgnoreSlice(start, end, length)) return List(this);
  if (isEmptySlice(start, end, length)) return empty;
  var left = getLeft(this);
  var right = getRight(this);
  if (left && right) return List(sliceTree.call(this, start, end, left, right));
  return List(this.slice(start, end));
}

function concat (...values) {
  switch (values.length) {
    case 0: return List(this);
    case 1: {
      var value = values[0];
      var test = value && typeof value === "object";
      var concatStore = getStore(this, "concat");
      if (test && concatStore.has(value)) return concatStore.get(value);

      if (isArray(value)) {
        if (value.length === 0) {
          var list = List(this);
          concatStore.set(value, list);
          return list;
        }

        var listValue = List(value);
        if (concatStore.has(listValue)) return concatStore.get(listValue);
        var newList = List(this.concat(listValue));
        setLeft(newList, List(this));
        setRight(newList, List(value));
        concatStore.set(value, newList);
        return newList;
      }

      var create = List(this.concat(value));
      setLeft(create, List(this));
      setRight(create, List([value]));
      test && concatStore.set(value, create);
      return create;
    }
    default: {
      var next = [];
      var bit = -1;
      values.forEach((value) => {
        if (isArray(value)) {
          if (value.length === 0) return;
          bit = -1;
          return next.push(List(value));
        }
        if (bit > -1) return next[bit].push(value);
        bit = next.length;
        return next.push([value]);
      });

      if (next.length === 0) return List(this);

      var concatStore = getStore(this, "concat");
      var value = next.reduce((create, value) => {
        if (concatStore.has(value)) return concatStore.get(value);
        var next = List(create.concatStore(value));
        setLeft(next, List(create));
        setRight(next, List(value));
        concatStore.set(List(value), List(next));
        return next;
      }, this);

      if (value.length === length) return List(this);
      return List(value);
    }
  }
}

var reversed = new WeakMap();
function toReversed () {
  if (reversed.has(this)) return reversed.get(this);
  var left  = getLeft(this);
  var right = getRight(this);
  if (left && right) return reversed.set(this, right.toReversed().concat(left.toReversed())).get(this);
  return reversed.set(this, this.toReversed()).get(this);
}

function toSorted (call) {
  var sortedStore = getStore(this, "toSorted");
  if (sortedStore.has(call)) return sortedStore.get(call);
  var length = this.length;
  if (length < 2) return sortedStore.set(call, List(this)).get(call);

  var left = getLeft(this);
  var right = getRight(this);
  if (left && right) {
    var sortedLeft  = left.toSorted(call);
    var sortedRight = right.toSorted(call);
    var newArray    = Array(length);
    var index       = 0;
    var leftIndex   = 0;
    var rightIndex  = 0;
    var leftLength  = sortedLeft.length;
    var rightLength = sortedRight.length;
    var min         = Math.min(leftLength, rightLength);
    while (index < min) {
      if (call(sortedLeft[leftIndex], sortedRight[rightIndex]) < 0) {
        newArray[index] = sortedLeft[leftIndex];
        leftIndex++;
      } else {
        newArray[index] = sortedRight[rightIndex];
        rightIndex++;
      }
      index++;
    }
    while (leftIndex < leftLength) {
      newArray[index] = sortedLeft[leftIndex];
      leftIndex++;
      index++;
    }
    while (rightIndex < rightLength) {
      newArray[index] = sortedRight[rightIndex];
      rightIndex++;
      index++;
    }

    return sortedStore.set(call, List(newArray)).get(call);
  }

  return sortedStore.set(call, List(this.toSorted(call))).get(call);
}

var use = new Map(Object.entries({
  findIndex,
  findLastIndex,
  find,
  findLast,
  filter,
  map,
  flatMap,

  toReversed,
  toSorted,

  slice,
  concat,
}));


var matchKey = (values) => (key) => values.has(key);
var isMutation = matchKey(new Set(["push", "pop", "splice", "shift", "unshift", "sort", "reverse"]));

function get (target, key) {
  if (key === symbol) return true;
  if (isMutation(key)) return undefined;
  return use.has(key) ? use.get(key).bind(target) : target[key];
}

function set (target, key, value) {
  if (target[key] === value) return value;
  throw TypeError("Cannot set properties of List (setting " + key + ")");
}

var List = memoizeWeak((values) => values[symbol] ? values : values.length === 0 ? empty : new Proxy((values), {
  get: get,
  set: set,
}));

var Executors = new Map();

var allowWeak = {
  findIndex,
  findLastIndex,
  find,
  findLast,
  filter,
  map,
  flatMap,
  toSorted,
};

var keys = {
  empty,
  use: (exec, name) => {
    use.set(exec.name || name, exec);
    return List;
  },
}

export default new Proxy(List, {
  get: function (target, key) {
    if (Executors.has(key)) return Executors.get(key);
    if (keys[key]) return keys[key];
    if (allowWeak) {
      var executor = memoizeWeak((call) => memoizeWeak((value) => allowWeak[key].call(List(value), call)));
      return Executors.set(key, executor).get(key);
    }

    if (use.has(key)) {
      var executor = (...values) => (value) => use.get(key).call(List(value), ...values);
      return Executors.set(key, executor).get(key);
    }

    return use.has(key) ? use.get(key) : target[key];
  },
});
