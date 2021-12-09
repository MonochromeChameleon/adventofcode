import { QuestionBase } from '../utils/question-base.js';

export class Question extends QuestionBase {
  constructor (args) {
    super(9, 15, 491, 1134, 1075536, args);
  }

  parseLine(line) {
    return line.split('').map(Number);
  }

  parseInput (lines) {
    const grid = lines.flatMap(this.parseLine);
    const width = grid.length / lines.length;
    const height = lines.length;

    return { grid, width, height };
  }

  part1 ({ grid, width }) {
    const isMinimum = (value, ix) => {
      const up = ix - width >= 0 ? grid[ix - width] : 9;
      const down = ix + width < grid.length ? grid[ix + width] : 9;
      const left = ix % width === 0 ? 9 : grid[ix - 1];
      const right = (ix + 1) % width === 0 ? 9 : grid[ix + 1];

      return [up, down, left, right].every(it => it > value);
    }
    const minima = grid.filter(isMinimum);
    return minima.reduce((sum, point) => sum + point, 0) + minima.length;
  }

  part2 ({ input, grid, width }) {
    const findRootBasin = (ix, combined) => combined[ix] === ix ? ix : findRootBasin(combined[ix], combined);

    const { basins } = grid.reduce((state, point, ix) => {
      if (point === 9) return state;

      const left = ix % width === 0 ? undefined : ix - 1;
      const up = ix - width >= 0 ? ix - width : undefined;

      const isNew = [left, up].every(it => grid[it] === undefined || grid[it] === 9);
      if (isNew) {
        const basin = state.basins.length;
        state.mapped[ix] = basin;
        state.combined[basin] = basin;
        state.basins.push(1);
      } else {
        const leftBasin = findRootBasin(state.mapped[left], state.combined);
        const upBasin = findRootBasin(state.mapped[up], state.combined);

        const [basin, combine] = [leftBasin, upBasin].filter(it => it !== undefined).sort((a, b) => a - b);
        state.mapped[ix] = basin;
        state.basins[basin] += 1;

        if (combine && combine !== basin) {
          state.basins[basin] += state.basins[combine];
          state.basins[combine] = 0;
          state.combined[combine] = state.combined[basin];
        }
      }
      return state;
    }, { basins: [0], mapped: [], combined: {} });

    const [big, medium, small] = basins.sort((a, b) => b - a);
    return big * medium * small;
  }
}
