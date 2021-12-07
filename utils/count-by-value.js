export function countByValue(numbers) {
  return numbers.reduce((acc, number) => {
    acc[number] = (acc[number] || 0) + 1;
    return acc;
  }, {});
}
