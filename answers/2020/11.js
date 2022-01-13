import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2020, 11);
  }

  parseLine(line) {
    return Number(line);
  }

  parseInput(lines) {
    return lines.map(this.parseLine);
  }

  part1 (input) {
    return input.length;
  }

  part2 (input) {
    return input.reduce((a, b) => a + b, 0);
  }
}
