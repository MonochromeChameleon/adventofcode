import { QuestionBase } from '../../utils/question-base.js';
import { parseGrid, adjacentIndices } from '../../utils/grid-utils.js';
import { aStarSearch } from '../../utils/a-star.js';

export class Question extends QuestionBase {
  constructor() {
    super(2021, 15, 410, 2809);

    this.exampleInput({ filename: 'testinputs/15', part1: 40, part2: 315 });
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

  part1({ grid, width, adjacentIndexes }) {
    const [, ...path] = aStarSearch(
      0,
      width * width - 1,
      (_, ix) => grid[ix],
      this.h(width),
      (ix) => adjacentIndices(ix, width, 4)
    );
    return path.reduce((acc, ix) => acc + grid[ix], 0);
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

    const [, ...path] = aStarSearch(0, fiveW * fiveW - 1, getGridRisk, this.h(fiveW), (ix) =>
      adjacentIndices(ix, fiveW, 4)
    );
    return path.reduce((acc, ix) => acc + getGridRisk(ix), 0);
  }
}
