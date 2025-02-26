import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2024, 10, 737, 1619);

    this.exampleInput({ part1: 36, part2: 81 });
  }

  get parser() {
    return Parsers.GRID;
  }

  parseValue(value) {
    return Number(value);
  }

  getEndpoints(grid, adjacencyMap, ix) {
    const current = grid[ix];
    if (current === 9) return ix;
    const nexts = adjacencyMap[ix].filter((ax) => grid[ax] === current + 1);
    return nexts.flatMap((n) => this.getEndpoints(grid, adjacencyMap, n));
  }

  countTrails(grid, adjacencyMap, ix) {
    const current = grid[ix];
    if (current === 9) return 1;
    const nexts = adjacencyMap[ix].filter((ax) => grid[ax] === current + 1);
    return nexts.flatMap((n) => this.countTrails(grid, adjacencyMap, n)).reduce((a, b) => a + b, 0);
  }

  part1({ grid, adjacencyMap }) {
    return grid.map((value, ix) => value === 0 ? this.getEndpoints(grid, adjacencyMap, ix) : []).map((es) => new Set(es).size).reduce((a, b) => a + b, 0);
  }

  part2({ grid, adjacencyMap }) {
    return grid.map((value, ix) => value === 0 ? this.countTrails(grid, adjacencyMap, ix) : 0).reduce((a, b) => a + b, 0);
  }
}
