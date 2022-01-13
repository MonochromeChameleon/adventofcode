import { QuestionBase } from '../../utils/question-base.js';
import { parseGrid } from '../../utils/grid-utils.js';

export class Question extends QuestionBase {
  constructor() {
    super(2021, 9, 491, 1075536);

    this.testInput('./testinputs/9.txt', 15, 1134);
  }

  parseInput(lines) {
    return parseGrid({ lines, pad: 9, adjacency: 4 });
  }

  part1({ grid, width, adjacentIndexes }) {
    const isMinimum = (value, ix) => adjacentIndexes[ix].every((a) => grid[a] > value);
    const minima = grid.filter(isMinimum);
    return minima.reduce((sum, point) => sum + point, 0) + minima.length;
  }

  part2({ input, grid, width }) {
    const findRootBasin = (ix, combined) => (combined[ix] === ix ? ix : findRootBasin(combined[ix], combined));

    const { basins } = grid.reduce(
      (state, point, ix) => {
        if (point === 9) return state;

        const left = ix - 1;
        const up = ix - width;

        const isNew = [left, up].every((it) => grid[it] === 9);

        const leftBasin = findRootBasin(state.mapped[left], state.combined);
        const upBasin = findRootBasin(state.mapped[up], state.combined);

        const [basin = state.basins.length, combine = basin] = [leftBasin, upBasin]
          .filter((it) => it !== undefined)
          .sort((a, b) => a - b);
        if (isNew) {
          state.basins.push(0);
          state.combined[basin] = basin;
        }

        state.mapped[ix] = basin;
        state.basins[basin] += 1;

        if (combine !== basin) {
          state.basins[basin] += state.basins[combine];
          state.basins[combine] = 0;
          state.combined[combine] = state.combined[basin];
        }

        return state;
      },
      { basins: [0], mapped: [], combined: {} }
    );

    const [big, medium, small] = basins.sort((a, b) => b - a);
    return big * medium * small;
  }
}
