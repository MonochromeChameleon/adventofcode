export const testData = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`;

export const results = {
  test: {
    part1: 198,
    part2: 230
  },
  actual: {
    part1: 3923414,
    part2: 5852595
  }
};

export async function parseFile(lines) {
  return lines.map(line => line.split('').map(Number));
}

export async function part1(input) {
  const totals = input.reduce((acc, row) => {
    return row.map((bit, ix) => bit + acc[ix])
  }, Array.from({ length: 12 }).map(it => 0));

  const gamma = parseInt(totals.map(it => it >= input.length / 2 ? 1 : 0).join(''), 2);
  const epsilon = parseInt(totals.map(it => it < input.length / 2 ? 1 : 0).join(''), 2);
  return gamma * epsilon;
}

export async function part2(input) {
  const splitByBit = (values, bit) => [values.filter(it => it[bit] === 0), values.filter(it => it[bit] === 1)];
  const mostByBit = ([zero, one]) => zero.length > one.length ? zero : one;
  const leastByBit = ([zero, one]) => {
    if (!zero.length) return one;
    if (!one.length) return zero;
    return zero.length <= one.length ? zero : one;
  }

  const oxygenRating = parseInt(input[0].reduce((acc, _, ix) => mostByBit(splitByBit(acc, ix)), input).flat(Infinity).join(''), 2);
  const co2Rating = parseInt(input[0].reduce((acc, _, ix) => leastByBit(splitByBit(acc, ix)), input).flat(Infinity).join(''), 2);

  return oxygenRating * co2Rating;
}
