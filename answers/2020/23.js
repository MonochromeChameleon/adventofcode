import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2020, 23);
  }

  get parser() {
    return Parsers.ONE_NUMBER_PER_LINE;
  }

  part1 (input) {
    return input.length;
  }

  part2 (input) {
    return input.reduce((a, b) => a + b, 0);
  }
}
