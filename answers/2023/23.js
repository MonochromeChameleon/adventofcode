import { Parsers, QuestionBase } from '../../utils/question-base.js';
import { dijkstra } from '../../utils/dijkstra.js';
import { reconstructPath } from '../../utils/a-star.js';

export class Question extends QuestionBase {
  constructor() {
    super(2023, 23, 2370, 6546);

    this.exampleInput({ part1: 94, part2: 154 });
  }

  get parser() {
    return Parsers.GRID;
  }

  bfs(distances, start, end, visited = []) {
    if (start === end) return 0;
    return distances.filter(({ from, to }) => from === start && !visited.includes(to))
      .reduce((max, { to, d }) =>  Math.max(max, this.bfs(distances, to, end, [...visited, start]) + d), -Infinity);
  }

  doTheThing(grid, adjacencyMap) {
    const start = grid.findIndex((c) => c === '.');
    const end = grid.findLastIndex((c) => c === '.');
    const junctions = Array.from({ length: grid.length }, (_, ix) => ix)
      .filter((ix) => grid[ix] !== '#' && adjacencyMap[ix].filter((ii) => grid[ii] !== '#').length > 2);
    const nodes = [start, ...junctions, end];

    const pairs = nodes
      .flatMap((n) => nodes.map((nn) => ({ from: n, to: nn })))
      .filter(({ from, to }) => from !== to);

    const distances = pairs.map(({ from, to }) => {
      const d = dijkstra({
        start: from,
        end: to,
        neighbours: (ix, route) => {
          const visited = reconstructPath(route, ix);
          return adjacencyMap[ix]
            .filter((ii) => grid[ii] !== '#')
            .filter((ii) => grid[ix] === '.' || (grid[ix] === '>' ? ii === ix + 1 : ii > ix + 1))
            .filter((p) => !visited.includes(p)).filter((p) => p === to || !nodes.includes(p));
        }
      });
      return { from, to, d };
    }).filter(({ d }) => d.hasValue() && d.value > 0)
      .map(({ from, to, d }) => ({ from, to, d: d.value }));

    return this.bfs(distances, start, end);
  }

  part1({ grid, adjacencyMap }) {
    return this.doTheThing(grid, adjacencyMap);
  }

  part2({ grid, adjacencyMap }) {
    return this.doTheThing(grid.map((g) => g === '#' ? g : '.'), adjacencyMap, true);
  }
}
