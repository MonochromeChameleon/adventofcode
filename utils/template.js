export function template(year, day) {
  return `import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(${year}, ${day});
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
`;
}
