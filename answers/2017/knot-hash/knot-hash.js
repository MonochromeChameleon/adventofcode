function getLengths(input) {
  return [...input.split('').map((c) => c.charCodeAt(0)), 17, 31, 73, 47, 23];
}

export function knotHashRound(input, lengths, s = 0, i = 0) {
  return lengths.reduce(
    ({ crypt, skip, ix }, length) => {
      const underflow = Math.min(input.length, ix + length) - ix;
      const overflow = length - underflow;
      const reversed = [...crypt.slice(ix, ix + underflow), ...crypt.slice(0, overflow)].reverse();

      const first = overflow ? reversed.slice(underflow) : crypt.slice(0, ix);
      const second = overflow ? crypt.slice(overflow, overflow + input.length - length) : reversed;
      const third = overflow ? reversed.slice(0, underflow) : crypt.slice(ix + length);

      return {
        crypt: [...first, ...second, ...third],
        skip: skip + 1,
        ix: (ix + length + skip) % input.length,
      };
    },
    { crypt: input, skip: s, ix: i }
  );
}

function getSparseHash(lengths, size) {
  const { crypt: sparse } = Array.from({ length: 64 }).reduce(
    ({ crypt, skip, ix }) => knotHashRound(crypt, lengths, skip, ix),
    {
      crypt: Array.from({ length: size }, (_, i) => i),
      skip: 0,
      ix: 0,
    }
  );

  return sparse;
}

function condenseSparseHash(sparse) {
  return Array.from({ length: 16 }).map((_, i) => {
    const start = i * 16;
    const end = start + 16;
    return sparse.slice(start, end).reduce((a, b) => a ^ b);
  });
}

export function knotHash(input, size = 256) {
  const lengths = getLengths(input);
  const sparse = getSparseHash(lengths, size);
  const dense = condenseSparseHash(sparse);
  return dense.map((n) => n.toString(16).padStart(2, '0')).join('');
}
