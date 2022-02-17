import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2021, 1, 1292, 1262);

    this.exampleInput({ part1: 7, part2: 5 });
  }

  get parser() {
    return Parsers.ONE_NUMBER_PER_LINE;
  }

  compareWindows(input, size = 1) {
    return input.reduce((count, value, ix, arr) => {
      const previous = ix >= size ? arr[ix - size] : Infinity;
      return value > previous ? count + 1 : count;
    }, 0);
  }

  part1(input) {
    return this.compareWindows(input);
  }

  part2(input) {
    return this.compareWindows(input, 3);
  }
}
