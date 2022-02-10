import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2017, 16, 'kgdchlfniambejop', 'fjpmholcibdgeakn');

    this.exampleInput({ input: 's1,x3/4,pe/b', part1: 'baedc', part2: 'ceadb' }, 5, 2);
  }

  get parser() {
    return Parsers.SINGLE_LINE_SPLIT_MAP;
  }

  get split() {
    return ',';
  }

  parseValue(value) {
    const type = value[0];
    switch (type) {
      case 's': {
        const amount = Number(value.slice(1));
        return { type: 'spin', amount };
      }
      case 'x': {
        const [first, second] = value
          .slice(1)
          .split('/')
          .map(Number)
          .sort((a, b) => a - b);
        return { type: 'exchange', first, second };
      }
      case 'p': {
        const [first, second] = value.slice(1).split('/');
        return { type: 'partner', first, second };
      }
    }
  }

  spin({ amount }) {
    return this.slice(-amount).concat(this.slice(0, -amount));
  }

  exchange({ first, second }) {
    return this.slice(0, first)
      .concat(this[second])
      .concat(this.slice(first + 1, second))
      .concat(this[first])
      .concat(this.slice(second + 1));
  }

  partner({ first, second }) {
    const [f, s] = [this.indexOf(first), this.indexOf(second)].sort((a, b) => a - b);
    return this.slice(0, f)
      .concat(this[s])
      .concat(this.slice(f + 1, s))
      .concat(this[f])
      .concat(this.slice(s + 1));
  }

  dance(steps, start) {
    return steps.reduce((state, { type, ...params }) => this[type].call(state, params), start);
  }

  part1(steps, length = 16) {
    const start = Array.from({ length }, (_, i) => String.fromCharCode(i + 97));
    return this.dance(steps, start).join('');
  }

  part2(steps, length = 16, repeats = 1_000_000_000) {
    const start = Array.from({ length }, (_, i) => String.fromCharCode(i + 97));
    const seen = [];
    let out = start;
    while (out.join('') !== seen[0] && seen.length < repeats) {
      seen.push(out.join(''));
      out = this.dance(steps, out);
    }
    if (seen.length === repeats) {
      return out.join('');
    }
    return seen[repeats % seen.length];
  }
}
