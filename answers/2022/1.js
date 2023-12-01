import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2022, 1, 67633, 199628);

    this.exampleInput({ filename: '1a', part1: 24000, part2: 45000 });
  }

  get parser() {
    return Parsers.ONE_NUMBER_PER_LINE;
  }

  get retainEmptyLines() {
    return true;
  }

  postParse(lines) {
    const groups = lines.reduce(
      ([g, ...gs], l) => {
        if (l === 0) return [[], g, ...gs];
        return [[l, ...g], ...gs];
      },
      [[]],
    );

    return groups.map((g) => g.reduce((a, b) => a + b, 0)).sort((a, b) => b - a);
  }

  part1([input]) {
    return input;
  }

  part2(input) {
    return input.slice(0, 3).reduce((a, b) => a + b, 0);
  }
}
