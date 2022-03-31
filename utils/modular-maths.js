export function gcdExtended(a, b) {
  let x = BigInt(0);
  let y = BigInt(1);
  let u = BigInt(1);
  let v = BigInt(0);
  while (a) {
    const q = ~~(b / a);
    [x, y, u, v] = [u, v, x - u * q, y - v * q];
    [a, b] = [b % a, a];
  }
  return [b, x, y];
}

export function modularInverse(value, modulo) {
  const [g, x] = gcdExtended(value, modulo);
  if (g !== BigInt(1)) /* c8 ignore next */ throw new Error('Bad mod inverse');
  return (x + modulo) % modulo;
}

export function modularDivide(value, divisor, modulo) {
  return (value * modularInverse(divisor, modulo)) % modulo;
}
