import { QuestionBase } from '../../utils/question-base.js';
import { parseGrid, padGrid } from '../../utils/grid-utils.js';

function getBinary(ix, width, grid, pad) {
  const upLeft = ix >= width && ix % width ? grid[ix - width - 1] : pad;
  const up = ix >= width ? grid[ix - width] : pad;
  const upRight = ix >= width && (ix + 1) % width ? grid[ix - width + 1] : pad;
  const left = ix % width ? grid[ix - 1] : pad;
  const self = grid[ix];
  const right = (ix + 1) % width ? grid[ix + 1] : pad;
  const downLeft = ix < width * (width - 1) && ix % width ? grid[ix + width - 1] : pad;
  const down = ix < width * (width - 1) ? grid[ix + width] : pad;
  const downRight = ix < width * (width - 1) && (ix + 1) % width ? grid[ix + width + 1] : pad;

  return [upLeft, up, upRight, left, self, right, downLeft, down, downRight].join('');
}

export class Question extends QuestionBase {
  constructor() {
    super(2021, 20, 5291, 16665);

    this.exampleInput({ filename: 'testinputs/20', part1: 35, part2: 3351 });
  }

  parseLine(line) {
    return line.split('').map((it) => (it === '#' ? 1 : 0));
  }

  parseInput([firstLine, ...rest]) {
    const enhancementAlgorithm = this.parseLine(firstLine);
    const grid = parseGrid({ lines: rest, parseLine: this.parseLine });
    return { enhancementAlgorithm, ...grid };
  }

  enhance(grid, enhancementAlgorithm, iteration) {
    const i0 = enhancementAlgorithm[0];
    const i1 = i0 ? enhancementAlgorithm[enhancementAlgorithm.length - 1] : i0;
    const fill = iteration % 2 ? i1 : i0;

    const width = Math.sqrt(grid.length);

    const newGrid = padGrid({ grid, width, padSize: 1, pad: fill });
    return newGrid.map((_, ix) => {
      const binary = getBinary(ix, width + 2, newGrid, fill);
      const decimal = parseInt(binary, 2);
      return enhancementAlgorithm[decimal];
    });
  }

  part1({ enhancementAlgorithm, grid }) {
    return Array.from({ length: 2 })
      .reduce((g, _, ix) => this.enhance(g, enhancementAlgorithm, ix + 1), grid)
      .reduce((acc, it) => acc + it, 0);
  }

  part2({ enhancementAlgorithm, grid }) {
    return Array.from({ length: 50 })
      .reduce((g, _, ix) => this.enhance(g, enhancementAlgorithm, ix + 1), grid)
      .reduce((acc, it) => acc + it, 0);
  }
}
