import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor (args) {
    super(2015, 2, undefined, 1586300, undefined, 3737498, args);
  }

  parseLine(line) {
    return line.split('x').map(Number);
  }

  parseInput(lines) {
    return lines.map(this.parseLine);
  }

  part1 (input) {
    return input.reduce((sum, [l,w,h]) => {
      const sides = [l*w, w*h, h*l];
      const min = Math.min(...sides);
      const surfaceArea = sides.reduce((sum, side) => sum + 2 * side, 0);
      return sum + surfaceArea + min;
    }, 0);
  }

  part2 (input) {
    return input.reduce((sum, [l,w,h]) => {
      const max = Math.max(...[l,w,h]);
      const perimiter = 2 * (l + w + h - max);
      const volume = l * w * h;
      return sum + perimiter + volume;
    }, 0);
  }
}
