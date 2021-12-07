import { QuestionBase } from '../utils/question-base.js';

export class Question extends QuestionBase {
  constructor (args) {
    super(7, 37, 168, 343468, 96086265, args);
  }

  parseLine(line) {
    return line.split(',').map(Number);
  }

  parseInput(lines) {
    const counts = lines.flatMap(this.parseLine).reduce((sofar, point) => {
      sofar[point] = (sofar[point] || 0) + 1;
      return sofar;
    }, {});

    const keys = Object.keys(counts).map(Number);
    const min = Math.min(...keys);
    const max = Math.max(...keys);

    return { counts, keys, min, max };
  }

  addFuel({ counts, keys, min, max }, fuelfunc) {
    return Array.from({ length: 1 + max - min })
      .map((_, i) => keys.reduce((sofar, key) => sofar + (fuelfunc(key - i) * counts[key]), 0))
  }

  part1 (input) {
    const results = this.addFuel(input, Math.abs);
    return Math.min(...results);
  }

  part2 (input) {
    const triangle = Array.from({ length: input.max }).reduce((t, _, ix) => {
      t[ix + 1] = t[ix] + ix + 1;
      return t;
    }, { 0: 0})
    const results = this.addFuel(input, steps => triangle[Math.abs(steps)]);
    return Math.min(...results);
  }
}
