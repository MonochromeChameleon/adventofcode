export function exampleInput(answer) {
  const ans = Number.isNaN(Number(answer)) ? `'${answer}'` : Number(answer);
  return `this.exampleInput({ part1: ${ans} });`;
}

export function template(year, day, answers = []) {
  return `import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(${year}, ${day});
    
    ${answers.map((a) => exampleInput(a)).join('\n    ')}
  }

  get parser() {
    return Parsers.ONE_NUMBER_PER_LINE;
  }

  part1(input) {
    return input.length;
  }

  part2(input) {
    return input.reduce((a, b) => a + b, 0);
  }
}
`;
}
