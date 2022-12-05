import { Parsers, QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2022, 4, 456, 808);

    this.exampleInput({
      input: [
        '2-4,6-8',
        '2-3,4-5',
        '5-7,7-9',
        '2-8,3-7',
        '6-6,4-6',
        '2-6,4-8'
      ],
      part1: 2,
      part2: 4
    });
  }

  get parser() {
    return Parsers.MULTI_LINE_SPLIT;
  }

  get split() {
    return ',';
  }

  parseValue(value) {
    const [from, to] = value.split('-').map(Number);
    return { from, to };
  }

  contains(a, b) {
    return a.from >= b.from && a.to <= b.to;
  }

  overlaps(a, b) {
    return (a.from >= b.from && a.from <= b.to) || (a.to >= b.from && a.to <= b.to);
  }

  part1(input) {
    return input.filter(([a, b]) => this.contains(a, b) || this.contains(b, a)).length;
  }

  part2(input) {
    return input.filter(([a, b]) => this.overlaps(a, b) || this.overlaps(b, a)).length;
  }
}
