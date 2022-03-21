import { IntcodeQuestion } from './intcode/intcode-question.js';
import { Vector } from '../../utils/vector.js';

export class Question extends IntcodeQuestion {
  constructor() {
    super(2019, 19, 169, 7001134);
  }

  getOutput(comp, x = 0, y = 5) {
    comp.reset();
    comp.input(x);
    comp.input(y);
    comp.toOutput();
    return new Vector(x, y, comp.output);
  }

  hasSquare(comp, size, { x, y }) {
    return [x, x + size - 1].every((xcorner) => [y, y + size - 1].every((ycorner) => this.getOutput(comp, xcorner, ycorner).z));
  }

  rowHasRange(comp, size, mins) {
    while (!this.getOutput(comp, mins.x, mins.y).z) mins.x += 1;

    return this.getOutput(comp, mins.x + size, mins.y).z;
  }

  part1(input, size = 50) {
    return Array.from({ length: size * size }, (_, i) => this.getOutput(input, i % size, ~~(i / size)).z).reduce(
      (a, b) => a + b
    );
  }

  part2(input, size = 100) {
    const mins = { x: 0, y: 5 };
    while (!this.rowHasRange(input, size, mins)) mins.y += 1;

    while (!this.hasSquare(input, size, mins)) {
      if (this.rowHasRange(input, size, mins)) {
        mins.x += 1;
      } else {
        mins.y += 1;
      }
    }

    return mins.x * 10000 + mins.y;
  }
}
