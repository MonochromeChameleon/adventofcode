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
