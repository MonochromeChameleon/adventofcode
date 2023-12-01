import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2020, 3, 244, 9406609920);

    this.exampleInput({ part1: 7, part2: 336 });
  }

  calculateSlope(lines, right, down) {
    return Array.from(
      { length: ~~(lines.length / down) },
      (_, yix) => lines[yix * down][(yix * right) % lines[0].length] === '#',
    ).reduce((a, b) => a + b);
  }

  part1(lines) {
    return this.calculateSlope(lines, 3, 1);
  }

  part2(lines) {
    return [
      [1, 1],
      [3, 1],
      [5, 1],
      [7, 1],
      [1, 2],
    ]
      .map(([right, down]) => this.calculateSlope(lines, right, down))
      .reduce((acc, it) => acc * it);
  }
}
