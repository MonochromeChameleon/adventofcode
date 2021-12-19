import { QuestionBase } from '../utils/question-base.js';

export class Question extends QuestionBase {
  constructor (args) {
    super(17, 45, 3003, 112, 940, args);
  }

  parseInput ([line]) {
    const [x1, x2, y1, y2] = /target area: x=([-\d]*)..([-\d]*), y=([-\d]*)..([-\d]*)/.exec(line).slice(1, 5).map(Number);
    return { x1, x2, y1, y2 };
  }

  triangularRoot (n) {
    return (Math.sqrt((8 * n) + 1) - 1) / 2;
  }

  triangle (n) {
    return n * (n + 1) / 2;
  }

  willLand (x, y, x1, x2, y1, y2) {
    if (x > x2 || y < y1) return false;
    if (x >= x1 && y <= y2) return true;
    return this.willLand(x && x - 1, y - 1, x1 - x, x2 - x, y1 - y, y2 - y);
  }

  part1 ({ y1 }) {
    return this.triangle(Math.abs(y1 + 1));
  }

  part2 ({ x1, x2, y1, y2 }) {
    const minX = Math.ceil(this.triangularRoot(x1));
    const maxX = x2;

    const minY = y1;
    const maxY = Math.abs(y1 + 1);

    const xs = Array.from({ length: maxX - minX + 1 }, (_, ix) => ix + minX);
    const ys = Array.from({ length: maxY - minY + 1 }, (_, iy) => iy + minY);

    const velocities = xs.flatMap((x) => ys.map((y) => ({ x, y })));
    return velocities.filter(({ x, y }) => this.willLand(x, y, x1, x2, y1, y2)).length;
  }
}