const LETTER_HASHES = {
  '891227c8912240': 'H',
  e0810204081070: 'I',
  '21449143060a120000': 'K',
  '1f214285f214280000': 'B',
  18102040810245000: 'J',
  240810207881020000: 'H',
  '13a448933a44890000': 'E',
  398000030000200000: 'Z',
  '3c0912450c10200000': 'C',
  '3c0400000000000000': 'B',
  c210a4c: 'J',
  '19297a52': 'A',
  '3d0e4210': 'F',
  39297292: 'R',
  '1084210f': 'L',
  '1c94b949': 'R',
  '1e11110f': 'Z',
  '1e87210f': 'E',
  c942126: 'C',
  c942d27: 'G',
  '1e872108': 'F',
};

export function letterSlice(grid, width, letterWidth = 7) {
  const count = Math.ceil(width / letterWidth);
  const height = ~~(grid.length / width);
  return Array.from({ length: count }, (_, i) => {
    const start = i * letterWidth;
    return Array.from({ length: height }, (__, j) => j).flatMap((j) => {
      const startIndex = j * width + start;
      const endIndex = Math.min(startIndex + letterWidth, (j + 1) * width);
      const slice = grid.slice(startIndex, endIndex);
      return Array.from({ length: letterWidth }, (__, k) => slice[k] || '.');
    });
  });
}

/* c8 ignore next 8 */
export function printLetter(grid, letterWidth = 7) {
  const height = ~~(grid.length / letterWidth);
  const out = Array.from({ length: height }, (_, j) => {
    const startIndex = j * letterWidth;
    return grid.slice(startIndex, startIndex + letterWidth).join('');
  }).join('\n');
  console.log(out);  
}

export function printLetters(grid, width) {
  const rows = Array.from({ length: grid.length / width }).map((no, ix) => grid.slice(ix * width, (ix + 1) * width));
   
  rows.forEach((r) => console.log(r.join('')));
}

function hex(grid) {
  const binary = grid.map((c) => (c === '#' ? 1 : 0)).reduce((a, b) => a + b, '');
  return parseInt(binary, 2).toString(16);
}

export function isLetter(grid) {
  return Object.keys(LETTER_HASHES).includes(hex(grid));
}

export function getLetter(grid) {
  return LETTER_HASHES[hex(grid)];
}
