import { QuestionBase } from '../utils/question-base.js';

export class Question extends QuestionBase {
  constructor (args) {
    super(7, 37, 343468, 168, 96086265, args);
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

  calculateFuel({ counts, keys, min, max }, fuelfunc = f => f) {
    const fuel = Array.from({ length: 1 + max - min })
      .map((_, i) => keys.reduce((sofar, key) => sofar + (fuelfunc(Math.abs(key - i)) * counts[key]), 0))
    return Math.min(...fuel);
  }

  part1 (input) {
    return this.calculateFuel(input);
  }

  part2 (input) {
    return this.calculateFuel(input, steps => steps * (steps + 1) / 2);
  }
}
