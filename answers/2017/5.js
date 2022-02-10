import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2017, 5, 364539, 27477714);

    this.exampleInput({ input: [0, 3, 0, 1, -3], part1: 5, part2: 10 });
  }

  get parser() {
    return Parsers.ONE_NUMBER_PER_LINE;
  }

  get mutates() {
    return true;
  }

  part1(input) {
    let ix = 0;
    let steps = 0;
    while (ix < input.length) {
      const increment = input[ix];
      input[ix] += 1;
      ix += increment;
      steps += 1;
    }
    return steps;
  }

  part2(input) {
    let ix = 0;
    let steps = 0;
    while (ix < input.length) {
      const increment = input[ix];
      const delta = increment >= 3 ? -1 : 1;
      input[ix] += delta;
      ix += increment;
      steps += 1;
    }
    return steps;
  }
}
