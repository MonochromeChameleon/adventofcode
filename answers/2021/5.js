import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor(args) {
    super(2021, 5, 5, 4993, 12, 21101, args);
  }

  parseLine(line) {
    const [x1, y1, x2, y2] = /^(\d+),(\d+) -> (\d+),(\d+)$/.exec(line).slice(1).map(Number);
    const count = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2)) + 1;
    const dx = x1 === x2 ? 0 : x1 < x2 ? 1 : -1;
    const dy = y1 === y2 ? 0 : y1 < y2 ? 1 : -1;

    const points = Array.from({ length: count }).map((_, ix) => `${x1 + ix * dx}:${y1 + ix * dy}`);

    return {
      isDiagonal: x1 !== x2 && y1 !== y2,
      points,
    };
  }

  countIntersections(lines, skipDiagonal) {
    return lines.reduce(
      (state, { isDiagonal, points }) => {
        if (isDiagonal && skipDiagonal) {
          return state;
        }
        return points.reduce(({ intersections, out }, point) => {
          if (intersections[point]) out += 1;
          intersections[point] = !(point in intersections);
          return { intersections, out };
        }, state);
      },
      { intersections: {}, out: 0 }
    ).out;
  }

  part1(input) {
    return this.countIntersections(input, true);
  }

  part2(input) {
    return this.countIntersections(input);
  }
}
