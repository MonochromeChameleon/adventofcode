import { Parsers, QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2023, 13, 37025, 32854);

    this.exampleInput({ part1: 405, part2: 400 });
  }

  get parser() {
    return Parsers.GROUP;
  }

  get retainEmptyLines() {
    return true;
  }

  get groupDelimiter() {
    return /^$/;
  }

  flipGrid(grid) {
    return Array.from(grid[0]).map((_, ix) => grid.map((g) => g[ix]).join(''));
  }

  getReflection(maybeGrid, flip = false, smudge = 0) {
    const grid = flip ? this.flipGrid(maybeGrid) : maybeGrid;
    let ix = 1;
    while (ix <= grid.length - 1) {
      const iix = ix;
      const differences = Array.from({ length: Math.min(iix, grid.length - iix) })
        .map((_, r) => grid[iix - r - 1].split('').filter((b, cix) => b !== grid[iix + r][cix]).length)
        .reduce((a, b) => a + b);
      if (differences === smudge) return iix;
      ix += 1;
    }
  }

  part1(input) {
    return input
      .map((group) => this.getReflection(group, true) || this.getReflection(group, false) * 100)
      .reduce((a, b) => a + b);
  }

  part2(input) {
    return input
      .map((group) => this.getReflection(group, true, 1) || this.getReflection(group, false, 1) * 100)
      .reduce((a, b) => a + b);
  }
}
