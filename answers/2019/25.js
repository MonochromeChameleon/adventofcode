import { IntcodeQuestion } from './intcode/intcode-question.js';

export class Question extends IntcodeQuestion {
  constructor() {
    super(2019, 25);
  }

  part1(input) {
    return input.length;
  }

  part2(input) {
    return input.reduce((a, b) => a + b, 0);
  }
}
