import { createHash } from 'crypto';

export function doHash(algorithm, prefix, i) {
  return createHash(algorithm)
    .update(prefix + i)
    .digest('hex');
}

export function find0xHash(algorithm, prefix, numZeroes, start = 0) {
  let i = start;
  let hash = doHash(algorithm, prefix, i);
  const target = '0'.repeat(numZeroes);
  while (hash.substr(0, numZeroes) !== target) {
    i += 1;
    hash = doHash(algorithm, prefix, i);
  }

  return i;
}
