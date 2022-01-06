import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor(args) {
    super(2021, 1, 7, 1292, 5, 1262, args);
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
