export function adjacentIndices(ix, width) {
  const upLeft = (ix >= width && ix % width) ? ix - width - 1 : undefined;
  const up = (ix >= width) ? ix - width : undefined;
  const upRight = (ix >= width && (ix + 1) % width) ? ix - width + 1 : undefined;
  const left = (ix % width) ? ix - 1 : undefined;
  const self = ix;
  const right = ((ix + 1) % width) ? ix + 1 : undefined;
  const downLeft = (ix < (width * (width - 1)) && ix % width) ? ix + width - 1 : undefined;
  const down = ix < (width * (width - 1)) ? ix + width : undefined;
  const downRight = (ix < (width * (width - 1)) && (ix + 1) % width) ? ix + width + 1 : undefined;

  return [upLeft, up, upRight, left, self, right, downLeft, down, downRight].filter(it => it !== undefined);
}

export function buildAdjacencyMap({ length, width, height }) {
  const arrayLength = length || (width * height);
  return Array.from({ length: arrayLength }).reduce((acc, _, ix) => ({ ...acc, [ix]: adjacentIndices(ix, width) }), {});
}
