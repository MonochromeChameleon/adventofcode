import { QuestionBase } from '../../utils/question-base.js';
import { triangle, triangularRoot } from '../../utils/triangle-utils.js';

export class Question extends QuestionBase {
  constructor() {
    super(2021, 17, 3003, 940);

    this.exampleInput({ input: 'target area: x=20..30, y=-10..-5', part1: 45, part2: 112 });
  }

  parseInput([line]) {
    const [x1, x2, y1, y2] = /target area: x=([-\d]*)..([-\d]*), y=([-\d]*)..([-\d]*)/
      .exec(line)
      .slice(1, 5)
      .map(Number);
    return { x1, x2, y1, y2 };
  }

  willLand(x, y, x1, x2, y1, y2) {
    if (x > x2 || y < y1) return false;
    if (x >= x1 && y <= y2) return true;
    return this.willLand(x && x - 1, y - 1, x1 - x, x2 - x, y1 - y, y2 - y);
  }

  part1({ y1 }) {
    return triangle(Math.abs(y1 + 1));
  }

  part2({ x1, x2, y1, y2 }) {
    const minX = Math.ceil(triangularRoot(x1));
    const maxX = x2;

    const minY = y1;
    const maxY = Math.abs(y1 + 1);

    const xs = Array.from({ length: maxX - minX + 1 }, (_, ix) => ix + minX);
    const ys = Array.from({ length: maxY - minY + 1 }, (_, iy) => iy + minY);

    const velocities = xs.flatMap((x) => ys.map((y) => ({ x, y })));
    return velocities.filter(({ x, y }) => this.willLand(x, y, x1, x2, y1, y2)).length;
  }
}
