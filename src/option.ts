type Option<T> = T | undefined;

export function map<T, U>(fn: (x: T) => U): (x: Option<T>) => Option<U> {
  return (x) => (x === undefined ? undefined : fn(x));
}

export function or<T>(y: Option<T>): (x: Option<T>) => Option<T> {
  return (x) => (x === undefined ? y : x);
}
