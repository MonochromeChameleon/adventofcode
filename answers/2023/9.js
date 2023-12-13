import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2023, 9, 1681758908, 803);

    this.exampleInput({ part1: 114, part2: 2 });
  }

  get parser() {
    return Parsers.MULTI_LINE_DELIMITED_NUMBERS;
  }

  get split() {
    return ' ';
  }

  extrapolate(row, forward) {
    if (row.every((r) => r === 0)) return 0;
    const next = row.slice(1).map((r, ix) => r - row[ix]);
    const extrapolated = this.extrapolate(next, forward);
    return forward ? row.pop() + extrapolated : row[0] - extrapolated;
  }

  part1(input) {
    return input.map((row) => this.extrapolate(row, true)).reduce((a, b) => a + b);
  }

  part2(input) {
    return input.map((row) => this.extrapolate(row, false)).reduce((a, b) => a + b);
  }
}
