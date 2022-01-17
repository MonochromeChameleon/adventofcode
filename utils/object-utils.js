export function flattenObject(objectOrArrayOrValue, ...path) {
  if (Array.isArray(objectOrArrayOrValue)) {
    return objectOrArrayOrValue.reduce((acc, value, ix) => ({
      ...acc,
      ...flattenObject(value, ...path, ix),
    }), { });
  }

  if (typeof objectOrArrayOrValue === 'object') {
    return Object.entries(objectOrArrayOrValue).reduce((acc, [key, value]) => ({
      ...acc,
      ...flattenObject(value, ...path, key),
    }), {});
  }

  return { [path.join('.')]: objectOrArrayOrValue };
}
