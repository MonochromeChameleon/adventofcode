export function adjacentIndices({ ix, width, adjacency, height = width }) {
  if (!adjacency) return [];
  // adjacency = 2, 4, 5, 8 or 9
  //   2 => down, right
  //   4 => up, down, left, right
  //   5 => up, down, left, right, self
  //   8 => up, down, left, right, diagonals
  //   9 => up, down, left, right, diagonals, self

  const upLeft = adjacency > 5 && ix >= width && ix % width ? ix - width - 1 : undefined;
  const up = adjacency > 2 && ix >= width ? ix - width : undefined;
  const upRight = adjacency > 5 && ix >= width && (ix + 1) % width ? ix - width + 1 : undefined;
  const left = adjacency > 2 && ix % width ? ix - 1 : undefined;
  const self = adjacency % 2 ? ix : undefined;
  const right = (ix + 1) % width ? ix + 1 : undefined;
  const downLeft = adjacency > 5 && ix < width * (height - 1) && ix % width ? ix + width - 1 : undefined;
  const down = ix < width * (height - 1) ? ix + width : undefined;
  const downRight = adjacency > 5 && ix < width * (height - 1) && (ix + 1) % width ? ix + width + 1 : undefined;

  return [upLeft, up, upRight, left, self, right, downLeft, down, downRight].filter((it) => it !== undefined);
}

export function buildAdjacencyMap({ length, width, height, adjacency = 9 }) {
  const arrayLength = length || width * height;
  return Array.from({ length: arrayLength }).map((_, ix) =>
    adjacentIndices({ ix, width, adjacency, height: arrayLength / width })
  );
}

export function padGrid({ grid, width, pad, padSize = 1 }) {
  const padRow = new Array(width + padSize * 2).fill(pad);
  const endPad = new Array(padSize).fill(pad);
  const padRows = new Array(padSize).fill(padRow).flat(Infinity);

  return [
    ...padRows,
    ...Array.from({ length: width }).flatMap((_, ix) => [
      ...endPad,
      ...grid.slice(width * ix, ix * width + width),
      ...endPad,
    ]),
    ...padRows,
  ];
}

export function shrinkGrid({ grid, pad, width }) {
  const height = grid.length / width;

  const minPad = grid.reduce((min, g, ix) => {
    if (g === pad) return min;

    const row = ~~(ix / width);
    const unRow = height - 1 - row;
    const col = ix % width;
    const unCol = width - 1 - col;

    return Math.min(min, row, unRow, col, unCol);
  }, Infinity);

  return grid.reduce((out, g, ix) => {
    const row = ~~(ix / width);
    const col = ix % width;

    if (row < minPad || col < minPad || row >= height - minPad || col >= width - minPad) return out;
    return [...out, g];
  }, []);
}

export function parseGrid({ lines, parseLine = (line) => line.split('').map(Number), adjacency, pad, padSize = 1 }) {
  if (pad === undefined) {
    const grid = lines.flatMap(parseLine);
    const width = lines[0].length;
    const adjacentIndexes = buildAdjacencyMap({ length: grid.length, width, adjacency });
    return { grid, width, adjacentIndexes };
  }
  const paddedPad = Array.from({ length: padSize }).fill(pad);
  const paddedParseLine = (line) => [...paddedPad, ...parseLine(line), ...paddedPad];
  const padRow = paddedParseLine(lines[0]).map(() => pad);
  const paddedPadRow = Array.from({ length: padSize }).flatMap(() => padRow);
  const grid = [...paddedPadRow, ...lines.flatMap(paddedParseLine), ...paddedPadRow];
  const width = padRow.length;
  const adjacentIndexes = buildAdjacencyMap({ length: grid.length, width, adjacency });
  return { grid, width, adjacentIndexes };
}
