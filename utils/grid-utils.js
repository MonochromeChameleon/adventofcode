export function adjacentIndices(ix, width, adjacency) {
  if (!adjacency) return [];
  // adjacency = 2, 4, 5, 8 or 9
  //   2 => down, right
  //   4 => up, down, left, right
  //   5 => up, down, left, right, self
  //   8 => up, down, left, right, diagonals
  //   9 => up, down, left, right, diagonals, self

  const upLeft = (adjacency > 5 && ix >= width && ix % width) ? ix - width - 1 : undefined;
  const up = (adjacency > 2 && ix >= width) ? ix - width : undefined;
  const upRight = (adjacency > 5 && ix >= width && (ix + 1) % width) ? ix - width + 1 : undefined;
  const left = (adjacency > 2 && ix % width) ? ix - 1 : undefined;
  const self = (adjacency % 2) ? ix : undefined;
  const right = ((ix + 1) % width) ? ix + 1 : undefined;
  const downLeft = (adjacency > 5 && ix < (width * (width - 1)) && ix % width) ? ix + width - 1 : undefined;
  const down = ix < (width * (width - 1)) ? ix + width : undefined;
  const downRight = (adjacency > 5 && ix < (width * (width - 1)) && (ix + 1) % width) ? ix + width + 1 : undefined;

  return [upLeft, up, upRight, left, self, right, downLeft, down, downRight].filter(it => it !== undefined);
}

export function buildAdjacencyMap({ length, width, height, adjacency = 9 }) {
  const arrayLength = length || (width * height);
  return Array.from({ length: arrayLength }).reduce((acc, _, ix) => ({ ...acc, [ix]: adjacentIndices(ix, width, adjacency) }), {});
}

export function parseGrid({ lines, parseLine = (line) => line.split('').map(Number), pad, adjacency }) {
  if (pad === undefined) {
    const grid = lines.flatMap(parseLine);
    const width = lines[0].length;
    const adjacentIndexes = buildAdjacencyMap({ length: grid.length, width, adjacency: adjacency });
    return { grid, width, adjacentIndexes };
  } else {
    const paddedParseLine = (line) => [pad, ...parseLine(line), pad];
    const padRow = paddedParseLine(lines[0]).map(() => pad);
    const grid = [...padRow, ...lines.flatMap(paddedParseLine), ...padRow];
    const width = lines[0].length + 2
    const adjacentIndexes = buildAdjacencyMap({ length: grid.length, width, adjacency: adjacency });
    return { grid, width, adjacentIndexes };
  }
}
