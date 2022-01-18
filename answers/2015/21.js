import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2015, 21, 600);
  }

  get parser() {
    return Parsers.PROPERTY_LIST;
  }

  get split() {
    return ':';
  }

  part1 (input) {
    return input;
  }

  part2 (input) {
    return input.reduce((a, b) => a + b, 0);
  }
}
