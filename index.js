export var always            = (value) => () => value;
export var F                 = always(false);
export var T                 = always(true);
var index                    = always(-1);
var nil                      = always(undefined);
export var alwaysEmptyString = always("");
export var alwaysEmptyList   = () => empty;

function*iterator(){}

var createMemoize = (constructor) => (call) => {
  var cache = new constructor();
  return (value, index, values) => cache.has(value) ? cache.get(value) : cache.set(value, call(value, index, values)).get(value);
}

export var memoize     = createMemoize(Map);
export var memoizeWeak = createMemoize(WeakMap);
export var memoWeak    = memoizeWeak(memoizeWeak);

var memoizeArray = (call) => {
  var map = new WeakMap();
  return (value, left, right) => map.has(value) ? map.get(value) : map.set(value, call(value, left, right)).get(value);
}


var symbolList = Symbol();
var isArray = Array.isArray;

var reverse = new WeakMap();

export var empty = new Proxy([], {
  get: (target, key) => {
    switch (key) {
      case symbolList: true;
      case "length": return 0;

      case "find"       :
      case "findLast"   :
      case "at"         :
        return nil;

      case "map"        :
      case "filter"     :
      case "flatMap"    :
      case "toSorted"   :
      case "toReversed" :
      case "toSpliced"  :
        return alwaysEmptyList;

      case "some"     :
      case "includes" : return F;
      case "every"    : return T;

      case "findIndex"     :
      case "findLastIndex" :
      case "indexOf"       :
      case "lastIndexOf"   : return index;

      case "push":
      case "pop":
      case "shift":
      case "unshift":
      case "splice":
      case "sort":
      case "reverse":
      case "fill":
        return void 0;

      case "toString":
      case "join":
      case "toLocaleString":
        return alwaysEmptyString;

      case "values":
      case "keys":
      case "entries":
        return iterator;

      case "concat":
        return (...values) => {
          switch (values.length) {
            case 0: return empty;
            case 1: return List(values[0]);
            default: return List(values.shift()).concat(...values);
          }
        }

      default:
        return Reflect.get(target, key);
    }
  }
});

var findIndexTree = (left, right) => memoizeWeak((call) => {
  var index = left.findIndex(call);
  return index === -1 ? right.findIndex(call) : index;
});

var findLastIndexTree = (left, right) => memoizeWeak((call) => {
  var index = right.findLastIndex(call);
  return index === -1 ? left.findLastIndex(call) : index;
});

var filterTree = (left, right) => {
  return memoizeWeak((call) => left.filter(call).concat(right.filter(call)));
}

var filterMemo = (values, findIndex, findLastIndex) => {
  var cache = new WeakMap();
  return (call) => {
    if (cache.has(call)) return cache.get(call);
    var leftIndex = findIndex(call);
    if (leftIndex === -1) return cache.set(call, empty) && empty;
    var rightIndex = findLastIndex(call);
    if (leftIndex === rightIndex) return cache.set(call, List([values[leftIndex]])).get(call);
    var create = values.slice(leftIndex, rightIndex + 1).filter(call);
    if (create.length === values.length) return cache.set(call, List(values)).get(call);
    return cache.set(call, List(create)).get(call);
  }
}

var createBTreeLikeSearching = (value, left, right) => {
  var findIndex;
  var findLastIndex;
  var filter;
  var slice;

  var find = (call) => {
    var index = findIndex(call);
    if (index === -1) return;
    return value[index];
  }

  var findLast = (call) => {
    var index = findLastIndex(call);
    if (index === -1) return;
    return value[index];
  }

  var some  = (call) => findIndex(call) !== -1;
  var every = (call) => filter(call).length === value.length;

  if (left && right) {
    findIndex     = findIndexTree(left, right);
    findLastIndex = findLastIndexTree(left, right);
    filter        = filterTree(left, right);

    slice = (start, end) => {
      if (start === void 0) return value;
      if (end === void 0) {
        if (start === 0) return value;
        if (start < 0) start = value.length + start;
        if (start > value.length) return empty;

        var leftLength = left.length;
        if (start < leftLength) return left.slice(0, start).concat(right);
        if (start > leftLength) return right.slice(start - leftLength);
        return right;
      }

      if (end === 0) return empty;
      if (end < 0)   end = value.length + end;

      var leftLength = left.length;
      if (start === 0) {
        if (end < leftLength) return left.slice(0, end);
        if (end > leftLength) return left.concat(right.slice(0, end - leftLength));
        return left;
      }

      if (start > leftLength) return right.slice(start - leftLength, end - leftLength);
      if (start < leftLength) return left.slice(start).concat(right.slice(0, end - leftLength));
      return right.slice(0, end);
    }
  } else {
    var _findIndex = new WeakMap();
    var _findLastIndex = new WeakMap();
    findIndex = (call) => {
      if (_findIndex.has(call)) return _findIndex.get(call);
      if (_findLastIndex.has(call)) {
        var index = _findLastIndex.get(call);
        if (index === -1) return index;
        index = value.findIndex((value, key, values) => key === index || call(value, key, values));
        _findIndex.set(call, index);
        return index;
      }
      var index = value.findIndex(call);
      _findIndex.set(call, index);
      return index;
    }

    findLastIndex = (call) => {
      if (_findLastIndex.has(call)) return _findLastIndex.get(call);
      if (_findIndex.has(call)) {
        var index = _findIndex.get(call);
        if (index === -1) return index;
        index = value.findLastIndex((value, key, values) => key === index || call(value, key, values));
        _findLastIndex.set(call, index);
        return index;
      }
      var index = value.findLastIndex(call);
      _findLastIndex.set(call, index);
      return index;
    }

    filter = filterMemo(value, findIndex, findLastIndex);

    slice = (start, end) => {
      var create = value.slice(start, end);
      if (create.length === 0) return empty;
      if (create.length === value.length) return List(value);
      return List(create);
    };
  }
  return ({
    find,
    findLast,
    findIndex,
    findLastIndex,
    filter,
    slice,
    some,
    every,
  });
}

/**
  * @template {*[]} Value
  * @param {Value} value
  */
var List = memoizeArray((value, left, right) => {
  if (!value) return empty;
  var length = value.length;
  if (value[symbolList]) return value;
  if (length === 0) return empty;

  var map     = new WeakMap();
  var flatMap = new WeakMap();
  var sort    = new WeakMap();

  var {
    find,
    findLast,
    findIndex,
    findLastIndex,
    some,
    every,
    filter,
    slice,
  } = createBTreeLikeSearching(value, left, right);

  var concat = new WeakMap();

  var is = new Proxy(value, {
    get: (target, key) => {
      switch (key) {
        case symbolList: true;
        case "toArray"       : return () => Reflect.get(target, key);
        case "value"         : return target;
        case "length"        : return length;
        case "findIndex"     : return findIndex;
        case "findLastIndex" : return findLastIndex;
        case "find"          : return find;
        case "findLast"      : return findLast;
        case "filter"        : return filter;
        case "slice"         : return slice;
        case "some"          : return some;
        case "every"         : return every;
        case "map": return (call) => {
          if (map.has(call)) return map.get(call);
          var value = List(target.map(call));
          map.set(call, value);
          return target.map(call);
        }
        case "flatMap": return (call) => {
          if (flatMap.has(is)) return flatMap.get(is);
          var value = List(target.flatMap(call));
          flatMap.set(call, value);
          return target.flatMap(call);
        }
        case "toReversed": return () => {
          if (length < 2) return is;
          if (reverse.has(is)) return reverse.get(is);
          var value = List(target.toReversed());
          reverse.set(is, value);
          reverse.set(value, is);
          return value;
        }
        case "toSorted": return (call) => {
          if (sort.has(is)) return sort.get(is);
          var value = List(target.toSorted(call));
          sort.set(call, value);
          return value;
        }

        case "concat": return (...values) => {
          switch (values.length) {
            case 0: return is;
            case 1: {
              var value = values[0];
              var test = value && typeof value === "object";
              if (test && concat.has(value)) return concat.get(value);

              if (isArray(value)) {
                if (value.length === 0) {
                  concat.set(value, is);
                  return is;
                }
                value = List(value);
                if (concat.has(value)) return concat.get(value);
              }

              var create = target.concat(value);
              if (create.length === length) create = is;
              else create = List(create, is, isArray(value) ? value : [value]);
              test && concat.set(value, create);
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

              var value = next.reduce((create, value) => {
                if (concat.has(value)) return concat.get(value);
                var next = List(create.concat(value), create, value);
                concat.set(value, next);
                return next;
              }, target);

              if (value.length === length) return is;
              return List(value);
            }
          }
        }

        case "push":
        case "pop":
        case "shift":
        case "unshift":
        case "splice":
        case "sort":
        case "reverse":
        case "fill":
          return void 0;

        default: {
          var value = target[key];
          if (value && value.constructor === Function) return (...values) => {
            var create = target[key].apply(target, values);
            if (isArray(create)) return List(create);
            return create;
          }
          return value;
        }
      }
    }
  });

  return is;
});

List.empty = empty;

export default List;
