// from https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
export function cartesianProduct(arr) {
  // a is a two-dimensional array
  return arr.reduce((a, b) => a.flatMap((d) => b.map((e) => [...d, e])), [[]]);
}

export function permutations(arr) {
  if (arr.length === 1) return [arr];
  return arr.map((a, i) => permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map((p) => [a, ...p])).flat(1);
}

export function maxBy(arr, prop) {
  return arr.reduce((a, b) => (a[prop] > b[prop] ? a : b));
}

export function allCombinations(arr) {
  return Array.from({ length: 2 ** arr.length }, (_, i) =>
    Array.from({ length: arr.length }, (__, k) => k)
      .filter((k) => i & (1 << k))
      .map((k) => arr[k])
  );
}

export function uniqueBy(arr, fn) {
  if (typeof fn === 'string') return uniqueBy(arr, (a) => a[fn]);
  return arr.filter((a, i) => arr.findIndex((b) => fn(a) === fn(b)) === i);
}
