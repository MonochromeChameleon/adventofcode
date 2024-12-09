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

export function hcf(a, b) {
  let msq = Math.floor(Math.min(Math.sqrt(a), Math.sqrt(b)));
  while (msq > 1) {
    if (a % msq === 0 && b % msq === 0) return msq;
    msq -= 1;
  }
  return msq;
}
