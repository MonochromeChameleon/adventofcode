export function factorial(number) {
  if (number < 0) {
    throw new Error('Factorial of negative number is undefined');
  }
  if (number === 0) {
    return BigInt(1);
  }
  return BigInt(number) * factorial(number - 1);
}
