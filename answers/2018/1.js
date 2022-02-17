import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2018, 1, 587, 83130);

    this.exampleInput({ input: [1, -2, 3, 1], part1: 3, part2: 2 });
    this.exampleInput({ input: [1, 1, 1], part1: 3 });
    this.exampleInput({ input: [1, 1, -2], part1: 0, part2: 0 });
    this.exampleInput({ input: [-1, -2, -3], part1: -6 });
    this.exampleInput({ input: [1, -1], part2: 0 });
    this.exampleInput({ input: [3, 3, 4, -2, -4], part2: 10 });
    this.exampleInput({ input: [-6, 3, 8, 5, -6], part2: 5 });
    this.exampleInput({ input: [7, 7, -2, -7, -4], part2: 14 });
  }

  get parser() {
    return Parsers.ONE_NUMBER_PER_LINE;
  }

  part1(input) {
    return input.reduce((a, b) => a + b);
  }

  part2(input) {
    const seen = [];
    let current = 0;
    for (let i = 0; !seen.includes(current); i += 1) {
      seen.push(current);
      current += input[i % input.length];
    }
    return current;
  }
}
