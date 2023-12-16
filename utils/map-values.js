export function mapValues(obj, mapper) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, mapper(v, k)]));
}
