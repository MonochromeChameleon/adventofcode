import { QuestionBase } from '../../utils/question-base.js';
import { countByValue } from '../../utils/count-by-value.js';

export class Question extends QuestionBase {
  constructor() {
    super(2021, 7, 343468, 96086265);

    this.exampleInput({ filename: 'testinputs/7', part1: 37, part2: 168 });
  }

  parseLine(line) {
    return line.split(',').map(Number);
  }

  parseInput(lines) {
    const raw = lines.flatMap(this.parseLine).sort((a, b) => a - b);
    const counts = countByValue(raw);

    const keys = Object.keys(counts).map(Number);
    const min = Math.min(...keys);
    const max = Math.max(...keys);

    const total = raw.length;

    return { counts, keys, min, max, raw, total };
  }

  calculateFuel({ position, keys, counts }, fuelfunc = (f) => f) {
    return keys.reduce((sofar, key) => sofar + fuelfunc(Math.abs(key - position)) * counts[key], 0);
  }

  calculateMedian({ counts, keys, raw, total }) {
    const medianIndex = ~~(total / 2);
    const position = raw[medianIndex];
    return this.calculateFuel({ position, keys, counts });
  }

  calculateMean({ counts, keys, total }) {
    const mean = keys.reduce((sofar, key) => sofar + key * counts[key], 0) / total;
    // Brute force the last two possibilities
    const meanPositions = [~~mean, Math.ceil(mean)];
    const fuels = meanPositions.map((position) =>
      this.calculateFuel({ position, keys, counts }, (steps) => (steps * (steps + 1)) / 2)
    );
    return Math.min(...fuels);
  }

  part1(input) {
    return this.calculateMedian(input);
    // return this.calculateFuel(input);
  }

  part2(input) {
    return this.calculateMean(input);
    // return this.calculateFuel(input, (steps) => (steps * (steps + 1)) / 2);
  }
}
