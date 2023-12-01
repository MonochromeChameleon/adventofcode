import { Parsers, QuestionBase } from '../../utils/question-base.js';
import { dijkstra } from '../../utils/dijkstra.js';

export class Question extends QuestionBase {
  constructor() {
    super(2022, 12, 449, 443);

    this.exampleInput({ filename: '12a', part1: 31, part2: 29 });
  }

  get parser() {
    return Parsers.GRID;
  }

  dijkstra({ grid, adjacencyMap, start, end }) {
    return dijkstra({
      start: grid.findIndex((s) => s === start),
      end: (index) => grid[index] === end,
      neighbours: (index) =>
        adjacencyMap[index].filter((ix) => {
          const diff = grid[index].charCodeAt(0) - grid[ix].charCodeAt(0);
          if (start === 'S') {
            if (grid[index] === 'S') return ['a', 'b'].includes(grid[ix]);
            if (grid[ix] === 'E') return ['y', 'z'].includes(grid[index]);
            return diff >= -1;
          }
          if (grid[index] === 'E') return ['y', 'z'].includes(grid[ix]);
          return diff <= 1;
        }),
    }).value;
  }

  part1(input) {
    return this.dijkstra({ ...input, start: 'S', end: 'E' });
  }

  part2(input) {
    return this.dijkstra({ ...input, start: 'E', end: 'a' });
  }
}
