import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2022, 25, '2---1010-0=1220-=010');

    this.exampleInput({ filename: '25a', part1: '2=-1=0' });
  }

  get parser() {
    return Parsers.MULTI_LINE_SPLIT;
  }

  fromSnafu(chars) {
    return chars
      .map((c, ix) => {
        switch (c) {
          case '-':
            return -1 * 5 ** ix;
          case '=':
            return -2 * 5 ** ix;
          default:
            return Number(c) * 5 ** ix;
        }
      }, 0)
      .reduce((a, b) => a + b);
  }

  snafu(decimal, snafu, power) {
    const residual = decimal - this.fromSnafu(snafu);
    const one = 5 ** power;
    const something = residual / one;
    snafu[power] = Math.round(something);
    return snafu;
  }

  toSnafu(decimal) {
    const highestPower = Math.ceil(Math.log(decimal) / Math.log(5));
    return Array.from({ length: highestPower }, (_, ix) => highestPower - ix)
      .reduce(
        (value, power) => this.snafu(decimal, value, power),
        Array.from({ length: highestPower }, () => 0),
      )
      .map((c) => {
        if (c === -1) return '-';
        if (c === -2) return '=';
        return c;
      })
      .reverse()
      .join('')
      .replace(/^0*/, '');
  }

  part1(input) {
    const decimal = input.map((inp) => this.fromSnafu(inp.reverse()));
    const total = decimal.reduce((a, b) => a + b);
    return this.toSnafu(total);
  }
}
