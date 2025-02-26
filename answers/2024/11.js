import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2024, 11, 220999, 261936432123724);

    this.exampleInput({ part1: 55312 });
  }

  get parser() {
    return Parsers.SINGLE_LINE_DELIMITED_NUMBERS;
  }

  get split() {
    return ' ';
  }

  splitRock(rock, splits) {
    if (splits === 0) return 1;
    if (rock === 0) return this.withCache.splitRock(1, splits - 1);
    const strock = String(rock);
    if (strock.length % 2 === 0) {
      const l = Number(strock.slice(0, strock.length / 2));
      const r = Number(strock.slice(strock.length / 2));

      return this.withCache.splitRock(l, splits - 1) + this.withCache.splitRock(r, splits - 1);
    }
    return this.withCache.splitRock(rock * 2024, splits - 1);
  }

  part1(input) {
    return input.map((rock) => this.withCache.splitRock(rock, 25)).reduce((a, b) => a + b, 0);
  }

  part2(input) {
    return input.map((rock) => this.withCache.splitRock(rock, 75)).reduce((a, b) => a + b, 0);
  }
}
