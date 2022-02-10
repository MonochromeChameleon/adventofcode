import { QuestionBase, Parsers } from '../../utils/question-base.js';

class Generator {
  constructor(line) {
    const [, label, start] = /^Generator (\w) starts with (\d+)$/.exec(line);
    this.label = label;
    this.start = Number(start);
    this.previous = this.start;
    this.factor = label === 'A' ? 16807 : 48271;
    this.modulus = 2147483647;
    this.multiple = label === 'A' ? 4 : 8;
  }

  reset() {
    this.previous = this.start;
  }

  next(multiple) {
    if (multiple) {
      do {
        this.previous = (this.previous * this.factor) % this.modulus;
      } while (this.previous & (this.multiple - 1));
    } else {
      this.previous = (this.previous * this.factor) % this.modulus;
    }
    return this.previous;
  }

  b16(multiple = false) {
    return this.next(multiple) & 0xffff;
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2017, 15, 600, 313);
    this.exampleInput({
      input: ['Generator A starts with 65', 'Generator B starts with 8921'],
      part1: 588,
      part2: 309,
    });
  }

  get parser() {
    return Parsers.MULTI_LINE_CONSTRUCTOR;
  }

  get inputConstructor() {
    return Generator;
  }

  reset([a, b]) {
    a.reset();
    b.reset();
  }

  execute(a, b, count, multiple) {
    let score = 0;
    for (let i = 0; i < count; i += 1) {
      if (a.b16(multiple) === b.b16(multiple)) score += 1;
    }
    return score;
  }

  part1([a, b]) {
    return this.execute(a, b, 40_000_000, false);
  }

  part2([a, b]) {
    return this.execute(a, b, 5_000_000, true);
  }
}
