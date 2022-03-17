export function countByValue(values) {
  return values.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

export function groupBy(values, mapper) {
  return values.reduce((acc, value) => {
    const key = mapper(value);
    acc[key] = (acc[key] || []).concat(value);
    return acc;
  }, {});
}

export function mapBy(values, mapper) {
  return values.reduce((acc, value) => {
    const key = mapper(value);
    acc[key] = value;
    return acc;
  }, {});
}

export function countBy(values, mapper) {
  return values.reduce((acc, value) => {
    const key = mapper(value);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}
