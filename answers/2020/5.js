import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2020, 5, 864, 739);

    this.exampleInput({ input: 'FBFBBFFRLR', part1: 357 });
    this.exampleInput({ input: 'BFFFBBFRRR', part1: 567 });
    this.exampleInput({ input: 'FFFBBBFRRR', part1: 119 });
    this.exampleInput({ input: 'BBFFBBFRLL', part1: 820 });
  }

  binarySplit(upper, instructions, up) {
    return instructions.reduce(
      ({ u, l }, next) => {
        const mid = l + (u - l) / 2;
        if (next === up) return { u, l: mid };
        return { u: mid, l };
      },
      { u: upper, l: 0 }
    ).l;
  }

  parseLine(line) {
    const row = this.binarySplit(128, line.slice(0, -3).split(''), 'B');
    const seat = this.binarySplit(8, line.slice(-3).split(''), 'R');

    return row * 8 + seat;
  }

  part1(input) {
    return input.reduce((max, i) => Math.max(max, i));
  }

  part2(input) {
    return input.sort((a, b) => a - b).find((it, ix, sorted) => sorted[ix + 1] !== it + 1) + 1;
  }
}
