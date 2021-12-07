import { QuestionBase } from '../utils/question-base.js';

export class Question extends QuestionBase {
  constructor (args) {
    super(5, 5, 12, 4993, 21101, args);
  }

  parseLine (line) {
    const [x1, y1, x2, y2] = /^(\d+),(\d+) -> (\d+),(\d+)$/.exec(line).slice(1).map(Number);
    return { x1, y1, x2, y2 };
  }

  parseInput (lines) {
    return lines.map(this.parseLine).flat();
  }

  getPoints({ x1, y1, x2, y2 }) {
    const count = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) + 1;
    const dx = x1 === x2 ? 0 : (x1 < x2 ? 1 : -1);
    const dy = y1 === y2 ? 0 : (y1 < y2 ? 1 : -1);
    return Array.from({ length: count }).map((_, ix) => `${x1 + (ix * dx)}:${y1 + (ix * dy)}`);
  }

  countIntersections(lines) {
    const points = lines.reduce((sofar, { x1, y1, x2, y2 }) => {
      const count = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) + 1;
      const dx = x1 === x2 ? 0 : (x1 < x2 ? 1 : -1);
      const dy = y1 === y2 ? 0 : (y1 < y2 ? 1 : -1);

      Array.from({ length: count }).forEach((_, ix) => {
        const point = `${x1 + (ix * dx)}:${y1 + (ix * dy)}`;
        sofar[point] = (sofar[point] || 0) + 1;
      });

      return sofar;
    }, {});

    return Object.values(points).filter(v => v > 1).length;
  }

  part1 (input) {
    const filtered = input.filter(({ x1, x2, y1, y2 }) => x1 === x2 || y1 === y2);
    return this.countIntersections(filtered);
  }

  part2 (input) {
    return this.countIntersections(input);
  }
}
