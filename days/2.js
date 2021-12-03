import { QuestionBase } from '../utils/question-base.js';

export class Question extends QuestionBase {
  constructor(args) {
    super(2, 150, 900, 1690020, 1408487760, args);
  }

  parseInput(lines) {
    return lines
      .map((line) => line.split(' '))
      .map(([direction, distance]) => ({ direction, distance: Number(distance) }));
  }

  updatePosition({ h, d, a }, { direction, distance }, aim = false) {
    const df = aim ? a : 0;
    const dv = aim ? 0 : 1;
    if (direction === 'forward') {
      return { h: h + distance, d: d + df * distance, a };
    }
    if (direction === 'up') {
      return { h, d: d - dv * distance, a: a - distance };
    }
    if (direction === 'down') {
      return { h, d: d + dv * distance, a: a + distance };
    }
    return { h, d, a };
  }

  part1(input) {
    const { h, d } = input.reduce((acc, delta) => this.updatePosition(acc, delta, false), { h: 0, d: 0, a: 0 });
    return h * d;
  }

  part2(input) {
    const { h, d } = input.reduce((acc, delta) => this.updatePosition(acc, delta, true), { h: 0, d: 0, a: 0 });
    return h * d;
  }
}
