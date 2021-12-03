export function template(day) {
  return `import { QuestionBase } from '../utils/question-base.js';

export class Question extends QuestionBase {
  constructor (args) {
    super(${day}, 1, 2, 3, 4, args);
  }

  parseInput (lines) {
    return lines.map(Number);
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
