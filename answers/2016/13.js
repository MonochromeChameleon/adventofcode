import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { aStarSearch } from '../../utils/a-star.js';

export class Question extends QuestionBase {
  constructor() {
    super(2016, 13, 86, 127);

    this.exampleInput({ input: 10, part1: 11 }, 7, 4);
  }

  get parser() {
    return Parsers.SINGLE_NUMBER;
  }

  distanceToGoal(xg, yg, x, y) {
    return Math.abs(x - xg) + Math.abs(y - yg);
  }

  findNeighbours(favouriteNumber, x, y) {
    return [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ]
      .filter((it) => it.every((c) => c >= 0))
      .filter(([x1, y1]) => {
        const polynomial = x1 * x1 + 3 * x1 + 2 * x1 * y1 + y1 + y1 * y1;
        const withFavouriteNumber = polynomial + favouriteNumber;
        const binary = withFavouriteNumber.toString(2);
        return (
          binary
            .split('')
            .map(Number)
            .reduce((a, b) => a + b) %
            2 ===
          0
        );
      })
      .map((it) => it.join(','));
  }

  part1(input, goalX = 31, goalY = 39) {
    const [, ...route] = aStarSearch({
      start: '1,1',
      goal: `${goalX},${goalY}`,
      h: (pos) => this.distanceToGoal(goalX, goalY, ...pos.split(',').map(Number)),
      neighbours: (pos) => this.findNeighbours(input, ...pos.split(',').map(Number)),
      searchSpaceSize: 0,
    });
    return route.length;
  }

  part2(input) {
    return Array.from({ length: 50 }).reduce(
      (positions) => {
        const nextMoves = positions
          .map((it) => it.split(',').map(Number))
          .flatMap(([x, y]) => this.findNeighbours(input, x, y));
        return [...new Set([...nextMoves, ...positions])];
      },
      ['1,1']
    ).length;
  }
}
