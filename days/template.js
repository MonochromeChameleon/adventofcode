export const testData = `
`;

export const results = {
  test: {
    part1: 0,
    part2: 0
  },
  actual: {
    part1: 0,
    part2: 0
  }
};

export async function parseFile(lines) {
  return lines.map(line => Number(line));
}

export async function part1(input) {
  return input.length;
}

export async function part2(input) {
  return input.length;
}

export const skip = true;
