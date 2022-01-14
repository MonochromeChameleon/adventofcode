import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2015, 1, 138, 1771);

    this.exampleInput({ input: '(())', part1: 0 });
    this.exampleInput({ input: '()()', part1: 0 });
    this.exampleInput({ input: '(((', part1: 3 });
    this.exampleInput({ input: '(()(()(', part1: 3 });
    this.exampleInput({ input: '))(((((', part1: 3 });
    this.exampleInput({ input: '())', part1: -1 });
    this.exampleInput({ input: '))(', part1: -1 });
    this.exampleInput({ input: ')))', part1: -3 });
    this.exampleInput({ input: ')())())', part1: -3 });

    this.exampleInput({ input: ')', part2: 1 });
    this.exampleInput({ input: '()())', part2: 5 });
  }

  parseInput(lines) {
    return lines.flatMap(it => it.split(''));
  }

  part1 (input) {
    return input.reduce((acc, it) => acc + (it === '(' ? 1 : -1), 0);
  }

  part2 (input) {
    let floor = 0;
    let inputs = input.length;

    while (floor > -1) {
      floor += input.shift() === '(' ? 1 : -1;
    }
    return inputs - input.length;
  }
}
