import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2021, 3, 3923414, 5852595);

    this.exampleInput({ part1: 198, part2: 230 });
  }

  get parser() {
    return Parsers.MULTI_LINE_DELIMITED_NUMBERS;
  }

  part1(input) {
    const totals = input.reduce(
      (acc, row) => row.map((bit, ix) => bit + acc[ix]),
      Array.from({ length: 12 }).map(() => 0),
    );

    const gamma = parseInt(totals.map((it) => (it >= input.length / 2 ? 1 : 0)).join(''), 2);
    const epsilon = parseInt(totals.map((it) => (it < input.length / 2 ? 1 : 0)).join(''), 2);
    return gamma * epsilon;
  }

  part2(input) {
    const splitByBit = (values, bit) => [values.filter((it) => it[bit] === 0), values.filter((it) => it[bit] === 1)];
    const mostByBit = ([zero, one]) => (zero.length > one.length ? zero : one);
    const leastByBit = ([zero, one]) => {
      if (!zero.length) return one;
      if (!one.length) return zero;
      return zero.length <= one.length ? zero : one;
    };

    const oxygenRating = parseInt(
      input[0]
        .reduce((acc, _, ix) => mostByBit(splitByBit(acc, ix)), input)
        .flat(Infinity)
        .join(''),
      2,
    );
    const co2Rating = parseInt(
      input[0]
        .reduce((acc, _, ix) => leastByBit(splitByBit(acc, ix)), input)
        .flat(Infinity)
        .join(''),
      2,
    );

    return oxygenRating * co2Rating;
  }
}
