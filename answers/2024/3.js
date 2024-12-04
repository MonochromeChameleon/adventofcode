import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2024, 3, 173517243, 100450138);

    this.exampleInput({ part1: 161 });
    this.exampleInput({ part2: 48 });
  }

  part1(input) {
    const rx = /mul\((\d{1,3}),(\d{1,3})\)/g;
    return input.flatMap((i) => [...i.matchAll(rx)]).map(([mul, a, b]) => Number(a) * Number(b)).reduce((a, b) => a + b, 0);
  }

  part2(input) {
    const [init, ...donts] = input.join('').split('don\'t()');
    const instructions = [init, ...donts.filter((d) => (/do\(\)/).test(d)).map((d) => d.substring(d.indexOf('do()')))];
    return this.part1(instructions);
  }
}
