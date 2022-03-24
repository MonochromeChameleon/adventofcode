import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2020, 9, 1930745883, 268878261);

    this.exampleInput({ part1: 127, part2: 62 }, 5);
  }

  get parser() {
    return Parsers.ONE_NUMBER_PER_LINE;
  }

  part1(input, preambleSize = 25) {
    return input.slice(preambleSize).find((v, ix) => {
      const preceding = input.slice(ix, ix + preambleSize);
      return !preceding.find((p, pix) => preceding.slice(pix + 1).find((it) => it === v - p));
    });
  }

  part2(input, preambleSize = 25) {
    const tgt = this.part1(input, preambleSize);
    let i = 0;
    let j = 1;
    let digits = input.slice(i, j);
    let sum = digits.reduce((a, b) => a + b);
    while (sum !== tgt) {
      if (sum > tgt) i += 1;
      if (sum < tgt) j += 1;
      digits = input.slice(i, j);
      sum = digits.reduce((a, b) => a + b);
    }

    const min = digits.reduce((a, b) => Math.min(a, b));
    const max = digits.reduce((a, b) => Math.max(a, b));

    return min + max;
  }
}
