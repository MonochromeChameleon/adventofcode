export function factorial(number) {
  if (number < 0) {
    throw new Error('Factorial of negative number is undefined');
  }
  if (number === 0) {
    return BigInt(1);
  }
  return BigInt(number) * factorial(number - 1);
}

export function lcm(a, b) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);

  let out = max;
  while (out % min !== 0) out += max;

  return out;
}
