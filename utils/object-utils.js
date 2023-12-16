export function flattenObject(objectOrArrayOrValue, ...path) {
  if (Array.isArray(objectOrArrayOrValue)) {
    return objectOrArrayOrValue.reduce(
      (acc, value, ix) => ({
        ...acc,
        ...flattenObject(value, ...path, ix),
      }),
      {},
    );
  }

  if (typeof objectOrArrayOrValue === 'object') {
    return Object.entries(objectOrArrayOrValue).reduce(
      (acc, [key, value]) => ({
        ...acc,
        ...flattenObject(value, ...path, key),
      }),
      {},
    );
  }

  return { [path.join('.')]: objectOrArrayOrValue };
}

export function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export function merge(first, second) {
  if (second === null) return null;
  if (first === undefined) return second;
  if (second === undefined) return first;

  if (Array.isArray(first) && Array.isArray(second)) {
    return Array.from({ length: Math.max(first.length, second.length) }, (_, ix) => merge(first[ix], second[ix]));
  }
  if (isObject(first) && isObject(second)) {
    const keys = [...new Set([...Object.keys(first), ...Object.keys(second)])];
    return Object.fromEntries(keys.map((key) => [key, merge(first[key], second[key])]).filter(([, v]) => v !== null));
  }

  return second;
}
