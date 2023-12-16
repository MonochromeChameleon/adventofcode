import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { Vector } from '../../utils/vector.js';

export class Question extends QuestionBase {
  constructor() {
    super(2023, 16, 8389, 8564);

    this.exampleInput({ part1: 46, part2: 51 });
  }

  get parser() {
    return Parsers.GRID;
  }

  getNewDirections(cell, direction, width) {
    switch (cell) {
      case '\\':
        return [Math.sign(direction) * (Math.abs(direction) === 1 ? width : 1)];
      case '/':
        return [-Math.sign(direction) * (Math.abs(direction) === 1 ? width : 1)];
      case '-':
        return Math.abs(direction) === 1 ? [direction] : [1, -1];
      case '|':
        return Math.abs(direction) === 1 ? [width, -width] : [direction];
      default:
        return [direction];
    }
  }

  energisedSquares(from, grid, adjacencyMap, width) {
    const stack = [from];
    const seen = {};
    while (stack.length) {
      const { square, direction } = stack.pop();
      if (seen[square]?.includes(direction)) continue;
      seen[square] ||= [];
      seen[square].push(direction);

      const nextSquares = this.getNewDirections(grid[square], direction, width)
        .filter((d) => adjacencyMap[square].includes(square + d))
        .map((d) => ({ square: square + d, direction: d }));
      stack.push(...nextSquares);
    }

    return Object.keys(seen).length;
  }

  part1({ grid, width, adjacencyMap }) {
    return this.energisedSquares({ square: 0, direction: 1 }, grid, adjacencyMap, width);
  }

  part2({ grid, width, height, adjacencyMap }) {
    const starts = [
      ...Array.from({ length: width }, (_, ix) => ({ square: ix, direction: width })),
      ...Array.from({ length: width }, (_, ix) => ({ square: grid.length - 1 - ix, direction: -width })),
      ...Array.from({ length: height }, (_, ix) => ({ square: ix * width, direction: 1 })),
      ...Array.from({ length: height }, (_, ix) => ({ square: (ix + 1) * width - 1, direction: -1 })),
    ];
    const ends = starts.map((s) => this.energisedSquares(s, grid, adjacencyMap, width));
    return ends.reduce((a, b) => Math.max(a, b));
  }
}
