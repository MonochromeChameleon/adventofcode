import { Parsers, QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2023, 1, 54951, 55218);

    this.exampleInput({ filename: '1a', part1: 142 });
    this.exampleInput({ filename: '1b', part2: 281 });
  }

  get parser() {
    return Parsers.ONE_STRING_PER_LINE;
  }

  findNumber(maybeNumberString, line, findFirst) {
    return ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
      .map((num, ix) => ({ value: `${ix + 1}`, index: maybeNumberString.indexOf(num) }))
      .filter(({ index }) => index >= 0)
      .reduce(
        (best, next) => (next.index < best.index) === findFirst ? next : best,
        {
          value: line[findFirst ? maybeNumberString.length : (line.length - maybeNumberString.length - 1)],
          index: findFirst ? maybeNumberString.length : -1
        }
      ).value;
  }

  getFirstAndLastWithWords(line) {
    const words = line.split(/\d+/);
    return [true, false].map((first) => this.findNumber(words[first ? 0 : words.length - 1], line, first));
  }

  part1(lines) {
    return lines.map((l) => l.replace(/\D/g, '').split(''))
      .map((ns) => parseInt(ns[0] + ns[ns.length - 1], 10))
      .reduce((a, b) => a + b);
  }

  part2(lines) {
    return lines.map((l) => this.getFirstAndLastWithWords(l))
      .map((ns) => parseInt(ns[0] + ns[ns.length - 1], 10))
      .reduce((a, b) => a + b);
  }
}
