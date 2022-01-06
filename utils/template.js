export function template(year, day) {
  return `import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor (args) {
    super(${year}, ${day}, undefined, undefined, undefined, undefined, args);
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
`;
}
