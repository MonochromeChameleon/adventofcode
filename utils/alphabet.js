const a = 'a'.charCodeAt(0);
const A = 'A'.charCodeAt(0);

export function alphabet(count = 26, uppercase = false) {
  return Array.from({ length: count }, (_, i) => String.fromCharCode((uppercase ? A : a) + i));
}
