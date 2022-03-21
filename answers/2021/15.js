import { QuestionBase } from '../../utils/question-base.js';
import { parseGrid, adjacentIndices } from '../../utils/grid-utils.js';
import { aStarSearch } from '../../utils/a-star.js';

export class Question extends QuestionBase {
  constructor() {
    super(2021, 15, 410, 2809);

    this.exampleInput({ part1: 40, part2: 315 });
  }

  parseInput(lines) {
    return parseGrid({ lines, adjacency: 4 });
  }

  h(width) {
    return (index) => {
      const row = ~~(index / width);
      const col = index % width;

      return Math.abs(row - width - 1) + Math.abs(col - width - 1);
    };
  }

  part1({ grid, width }) {
    return aStarSearch({
      start: 0,
      end: width * width - 1,
      d: (_, ix) => grid[ix],
      h: this.h(width),
      neighbours: (ix) => adjacentIndices({ ix, width, adjacency: 4 }),
    })
      .map((route) => route.slice(1))
      .map((route) => route.reduce((acc, ix) => acc + grid[ix], 0))
      .getOrThrow();
  }

  part2({ grid, width }) {
    const fiveW = width * 5;
    const getGridRisk = (index) => {
      const row = ~~(index / fiveW);
      const col = index % fiveW;
      const sourceRow = row % width;
      const sourceCol = col % width;
      const sourceIndex = sourceRow * width + sourceCol;

      const rowRepeat = ~~(row / width);
      const colRepeat = ~~(col / width);
      const increment = rowRepeat + colRepeat;

      return (grid[sourceIndex] + increment) % 9 || 9;
    };

    return aStarSearch({
      start: 0,
      end: fiveW * fiveW - 1,
      d: getGridRisk,
      h: this.h(fiveW),
      neighbours: (ix) => adjacentIndices({ ix, width: fiveW, adjacency: 4 }),
    })
      .map((route) => route.slice(1))
      .map((route) => route.reduce((acc, ix) => acc + getGridRisk(ix), 0))
      .getOrThrow();
  }
}
