export function minMax(numbers) {
  const min = numbers.reduce((a, b) => Math.min(a, b));
  const max = numbers.reduce((a, b) => Math.max(a, b));

  return { min, max };
}
