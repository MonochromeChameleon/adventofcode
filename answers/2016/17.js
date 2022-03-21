import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { dijkstra } from '../../utils/dijkstra.js';
import { doHash } from '../../utils/bad-blockchain.js';

export class Question extends QuestionBase {
  constructor() {
    super(2016, 17, 'RDRDUDLRDR', 386);

    this.exampleInput({ input: 'ihgpwlah', part1: 'DDRRRD', part2: 370 });
    this.exampleInput({ input: 'kglvqrro', part1: 'DDUDRLRRUDRD', part2: 492 });
    this.exampleInput({ input: 'ulqzkmiv', part1: 'DRURDRUDDLLDLUURRDULRLDUUDDDRR', part2: 830 });
  }

  get parser() {
    return Parsers.SINGLE_STRING;
  }

  calculateNeighbours(input, pos) {
    const [xs, ys, route] = pos.split(',');
    const [x, y] = [xs, ys].map(Number);
    if (x === 3 && y === 3) return [];

    const hash = doHash('md5', input, route);

    return [
      [x, y - 1, `${route}U`],
      [x, y + 1, `${route}D`],
      [x - 1, y, `${route}L`],
      [x + 1, y, `${route}R`],
    ]
      .filter((_, ix) => ['b', 'c', 'd', 'e', 'f'].includes(hash[ix]))
      .filter(([x1, y1]) => [x1, y1].every((n) => n >= 0 && n < 4))
      .map((parts) => parts.join(','));
  }

  part1(input) {
    return dijkstra({
      start: '0,0,',
      goal: (maybeGoal) => maybeGoal.startsWith('3,3'),
      neighbours: (pos) => this.calculateNeighbours(input, pos),
    }).map((result) => result[result.length - 1].replace('3,3,', '')).getOrThrow();
  }

  part2(input) {
    const paths = {};
    dijkstra({
      start: '0,0,',
      goal: (maybeGoal) => {
        if (maybeGoal.startsWith('3,3')) {
          const [, , route] = maybeGoal.split(',');
          paths[route] = route.length;
        }
        return false;
      },
      neighbours: (pos) => this.calculateNeighbours(input, pos),
    });

    return Object.values(paths).reduce((a, b) => Math.max(a, b));
  }
}
