import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2017, 13, 1632, 3834136);

    this.exampleInput({ part1: 24, part2: 10 });
  }

  parseLine(line) {
    const [depth, range] = line.split(':').map(Number);
    const repeat = 2 * (range - 1);
    return { depth, range, severity: range * depth, repeat, offset: depth % repeat };
  }

  isCaught(input, time) {
    return input.some(({ repeat, offset }) => (repeat - (offset + time)) % repeat === 0);
  }

  part1(input) {
    return input.reduce((total, { depth, severity, repeat }) => {
      if (depth % repeat) return total;

      return total + severity;
    }, 0);
  }

  part2(input) {
    let i = 0;
    while (this.isCaught(input, i)) i += 1;
    return i;
  }
}
