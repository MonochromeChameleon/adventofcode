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
    adjacentIndices({ ix, width, adjacency, height: arrayLength / width }),
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

export function shrinkGrid({ grid, width }) {
  const height = grid.length / width;
  const newWidth = width - 2;
  const newHeight = height - 2;

  return Array.from({ length: newWidth * newHeight }).map((_, ix) => {
    const row = 1 + Math.floor(ix / newWidth);
    const col = 1 + (ix % newWidth);

    return grid[row * width + col];
  });
}

export function joinGrids({ grids, tileWidth, gridsPerRow }) {
  return Array.from({ length: grids.length / gridsPerRow }).flatMap((_, ix) => {
    const blockRow = grids.slice(ix * gridsPerRow, (ix + 1) * gridsPerRow);
    return Array.from({ length: grids[0].length / tileWidth }).flatMap((__, i) =>
      blockRow.flatMap((block) => block.slice(i * tileWidth, (i + 1) * tileWidth)),
    );
  });
}

export function rotateGrid({ grid, width }) {
  const height = grid.length / width;
  const rotatedIndex = (ix) => width - 1 + width * (ix % width) - ~~(ix / height);
  return Array.from(grid, (_, ix) => rotatedIndex(ix)).map((ix) => grid[ix]);
}

export function flipGrid({ grid, width }) {
  const flippedIndex = (ix) => width * ~~(ix / width) + (width - 1 - (ix % width));
  return Array.from(grid, (_, ix) => flippedIndex(ix)).map((ix) => grid[ix]);
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

export function printGrid(grid, width) {
  const rows = Array.from({ length: grid.length / width }).map((no, ix) => grid.slice(ix * width, (ix + 1) * width));
   
  rows.forEach((r) => console.log(r.join('')));
}
