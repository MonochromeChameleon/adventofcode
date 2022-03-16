import { IntcodeQuestion } from './intcode/intcode-question.js';

export class Question extends IntcodeQuestion {
  constructor() {
    super(2019, 5, 4511442, 12648139);
  }

  part1() {
    return this.calculate(1);
  }

  part2() {
    return this.calculate(5);
  }
}
