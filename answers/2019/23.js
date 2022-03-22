import { IntcodeQuestion } from './intcode/intcode-question.js';

export class Question extends IntcodeQuestion {
  constructor() {
    super(2019, 23);
  }

  part1(intcode) {
    const computers = Array.from({ length: 50 }, (_, i) => this.newIntcode().input(i));


    return input.length;
  }

  part2(input) {
    return input.reduce((a, b) => a + b, 0);
  }
}
