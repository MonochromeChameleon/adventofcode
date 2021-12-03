export const testData = `199
200
208
210
200
207
240
269
260
263`;

export const results = {
  test: {
    part1: 7,
    part2: 5
  },
  actual: {
    part1: 1292,
    part2: 1262
  }
};

export async function parseFile(lines) {
  return lines.map(line => Number(line));
}

function compareWindows(input, size = 1) {
  return input.reduce((count, value, ix, arr) => {
    const previous = ix >= size ? arr[ix - size] : Infinity;
    return value > previous ? count + 1 : count;
  }, 0);
}

export async function part1(input) {
  return compareWindows(input);
}

export async function part2(input) {
  return compareWindows(input, 3);
}
