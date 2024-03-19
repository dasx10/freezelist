interface HashMap<Type = any, Key = any> {
  set: (key: Key, value: Value) => Type;
  get: (key: Key) => Type;
  has: (key: Key) => boolean;
}

export default function<Constructor extends HashMap>(constructor: Constructor): <Call extends (value: any) => any>(call: Call) => Call;
