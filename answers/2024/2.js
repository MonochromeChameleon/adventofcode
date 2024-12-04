import { Parsers, QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2024, 2, 279, 343);

    this.exampleInput({ part1: 2, part2: 4 });
  }

  get parser() {
    return Parsers.MULTI_LINE_DELIMITED_NUMBERS;
  }

  get split() {
    return /\s+/;
  }

  isSafe(first, ...rest) {
    let a = first;
    let b = rest[0]
    const sign = Math.sign(a - b);
    let isSafe = !!sign;
    for (let i = 0; i < rest.length && isSafe; i+= 1) {
      const nextSign = Math.sign(a - b);
      isSafe = nextSign === sign && Math.abs(a - b) <= 3;
      a = b;
      b = rest[i + 1];
    }
    return isSafe;
  }

  part1(input) {
    return input.filter((row) => this.isSafe(...row)).length;
  }

  part2(input) {
    return input.filter((row) => {
      const rows = [row, ...row.map((r, ix) => [...row.slice(0, ix), ...row.slice(ix + 1)])];
      return rows.some((r) => this.isSafe(...r));
    }).length;
  }
}
