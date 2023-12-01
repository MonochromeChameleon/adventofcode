import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2019, 24, 32523825, 2052);

    this.exampleInput({ part1: 2129920, part2: 99 }, 10);
  }

  get parser() {
    return Parsers.GAME_OF_LIFE;
  }

  get adjacency() {
    return 4;
  }

  next(value, neighbours) {
    const neighbugs = neighbours.filter((n) => n === '#').length;
    if (value === '.' && [1, 2].includes(neighbugs)) return '#';
    if (value === '#' && neighbugs !== 1) return '.';
    return value;
  }

  biodiversity(grid) {
    return grid.reduce((acc, sq, ix) => acc + (sq === '#' ? 2 ** ix : 0), 0);
  }

  innerNeighbours(ix, inner) {
    if (ix === 7) return [0, 1, 2, 3, 4].map((n) => inner[n]);
    if (ix === 11) return [0, 5, 10, 15, 20].map((n) => inner[n]);
    if (ix === 13) return [4, 9, 14, 19, 24].map((n) => inner[n]);
    if (ix === 17) return [20, 21, 22, 23, 24].map((n) => inner[n]);
    return [];
  }

  outerNeighbours(ix, outer) {
    if (ix === 0) return [outer[7], outer[11]];
    if ([1, 2, 3].includes(ix)) return [outer[7]];
    if (ix === 4) return [outer[7], outer[13]];
    if ([5, 10, 15].includes(ix)) return [outer[11]];
    if (ix === 20) return [outer[11], outer[17]];
    if ([9, 14, 19].includes(ix)) return [outer[13]];
    if (ix === 24) return [outer[13], outer[17]];
    if ([21, 22, 23].includes(ix)) return [outer[17]];
    return [];
  }

  infiniteGameOfLife(grid, adjacencyMap, inner = new Array(25).fill('.'), outer = new Array(25).fill('.')) {
    return grid.map((sq, ix) => {
      if (ix === 12) return '.';
      const neighbours = adjacencyMap[ix].map((n) => grid[n]);
      const innerNeighbours = this.innerNeighbours(ix, inner);
      const outerNeighbours = this.outerNeighbours(ix, outer);

      return this.next(sq, [...neighbours, ...innerNeighbours, ...outerNeighbours]);
    });
  }

  part1({ grid }) {
    const repeat = this.untilRepeat(grid);
    return this.biodiversity(repeat);
  }

  part2({ grid, adjacencyMap }, generations = 200) {
    return Array.from({ length: generations })
      .reduce(
        (grids) => {
          const innermost = grids[0];
          const outermost = grids[grids.length - 1];

          if ([7, 11, 13, 17].some((ix) => innermost[ix] === '#')) grids.unshift(new Array(25).fill('.'));
          if ([0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24].some((ix) => outermost[ix] === '#'))
            grids.push(new Array(25).fill('.'));

          return grids
            .map((g) => g.slice(0))
            .map((g, ix) => this.infiniteGameOfLife(g, adjacencyMap, grids[ix - 1], grids[ix + 1]));
        },
        [grid],
      )
      .reduce((sum, g) => sum + g.filter((sq) => sq === '#').length, 0);
  }
}
