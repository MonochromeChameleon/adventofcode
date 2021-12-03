export const testData = `forward 5
down 5
forward 8
up 3
down 8
forward 2`;

export const results = {
  test: {
    part1: 150,
    part2: 900
  },
  actual: {
    part1: 1690020,
    part2: 1408487760
  }
};

export async function parseFile(lines) {
  return lines.map(line => line.split(' ')).map(([direction, distance]) => ({ direction, distance: Number(distance) }));
}

export async function part1(input) {
  const { h, d } = input.reduce(({ h, d }, { direction, distance }) => {
    if (direction === 'forward') {
      return { h: h + distance, d };
    } else if (direction === 'up') {
      return { h, d: d - distance };
    } else if (direction === 'down') {
      return { h, d: d + distance };
    }
  }, { h: 0, d: 0 });

  return h * d;
}

export async function part2(input) {
  const { h, d } = input.reduce(({ h, d, a }, { direction, distance }) => {
    if (direction === 'forward') {
      return { h: h + distance, d: d + a * distance, a };
    } else if (direction === 'up') {
      return { h, d, a: a - distance };
    } else if (direction === 'down') {
      return { h, d, a: a + distance };
    }
  }, { h: 0, d: 0, a: 0 });

  return h * d;
}
