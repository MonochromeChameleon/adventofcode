import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2020, 11, 2424, 2208);

    this.exampleInput({ part1: 37, part2: 26 });
  }

  get parser() {
    return Parsers.GAME_OF_LIFE;
  }

  next(value, neighbours) {
    if (value === '.') return '.';
    if (value === 'L' && neighbours.every((n) => n !== '#')) return '#';
    if (value === '#' && neighbours.filter((n) => n === '#').length >= this.maxNeighbours) return 'L';
    return value;
  }

  extendedNeighbours(ix, grid, width, height) {
    if (grid[ix] === '.') return [];

    let nw = ix >= width && ix % width ? ix - (width + 1) : -1;
    while (nw >= width && nw % width && nw >= 0 && grid[nw] === '.') nw -= width + 1;

    let n = ix >= width ? ix - width : -1;
    while (n >= width && n >= 0 && grid[n] === '.') n -= width;

    let ne = ix >= width && (ix + 1) % width ? ix - (width - 1) : -1;
    while (ne >= width && (ne + 1) % width && ne >= 0 && grid[ne] === '.') ne -= width - 1;

    let w = ix % width ? ix - 1 : -1;
    while (w % width && w >= 0 && grid[w] === '.') w -= 1;

    let e = (ix + 1) % width ? ix + 1 : -1;
    while ((e + 1) % width && e >= 0 && grid[e] === '.') e += 1;

    let sw = ix < width * (height - 1) && ix % width ? ix + (width - 1) : -1;
    while (sw < width * (height - 1) && sw % width && sw >= 0 && grid[sw] === '.') sw += width - 1;

    let s = ix < width * (height - 1) ? ix + width : -1;
    while (s < width * (height - 1) && s >= 0 && grid[s] === '.') s += width;

    let se = ix < width * (height - 1) && (ix + 1) % width ? ix + width + 1 : -1;
    while (se < width * (height - 1) && (se + 1) % width && se >= 0 && grid[se] === '.') se += width + 1;

    return [nw, n, ne, w, e, sw, s, se].filter((nn) => grid[nn] && grid[nn] !== '.');
  }

  part1({ grid }) {
    this.maxNeighbours = 4;
    const repeat = this.untilRepeat(grid);
    return repeat.filter((s) => s === '#').length;
  }

  part2({ grid, width, height }) {
    this.maxNeighbours = 5;
    const newAdjacencyMap = grid.map((_, ix) => this.extendedNeighbours(ix, grid, width, height));
    const repeat = this.untilRepeat(grid, newAdjacencyMap);
    return repeat.filter((s) => s === '#').length;
  }
}
