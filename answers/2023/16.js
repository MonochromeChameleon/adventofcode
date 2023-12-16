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

  energisedSquares(from, grid, adjacencyMap, width) {
    let square = from.x;
    let direction = from.y;
    const squares = [from];
    const additionalStarts = [];
    while (true) {
      switch (grid[square]) {
        case '\\':
          direction = Math.sign(direction) * (Math.abs(direction) === 1 ? width : 1);
          break;
        case '/':
          direction = -Math.sign(direction) * (Math.abs(direction) === 1 ? width : 1);
          break;
        case '-':
          if (Math.abs(direction) === width) additionalStarts.push(new Vector(square, -1));
          direction = Math.abs(direction) === 1 ? direction : 1;
          break;
        case '|':
          if (Math.abs(direction) === 1) additionalStarts.push(new Vector(square, -width));
          direction = Math.abs(direction) === width ? direction : width;
          break;
      }
      let next = new Vector(square + direction, direction);
      if (!squares.some((s) => s.equals(next)) && adjacencyMap[square].includes(square + direction)) {
        squares.push(next);
        square += direction;
      } else if (additionalStarts.length) {
        next = additionalStarts.pop();
        while (additionalStarts.length && squares.some((s) => s.equals(next))) next = additionalStarts.pop();
        if (!squares.some((s) => s.equals(next))) {
          squares.push(next);
          square = next.x;
          direction = next.y;
        } else {
          return squares;
        }
      } else {
        return squares;
      }
    }
  }

  countEnergisedSquares(start, grid, adjacencyMap, width) {
    const squares = this.energisedSquares(start, grid, adjacencyMap, width);
    return [...new Set(squares.map(({ x }) => x))].length;
  }

  part1({ grid, width, adjacencyMap }) {
    return this.countEnergisedSquares(new Vector(0, 1), grid, adjacencyMap, width);
  }

  part2({ grid, width, height, adjacencyMap }) {
    const starts = [
      ...Array.from({ length: width }, (_, ix) => new Vector(ix, width)),
      ...Array.from({ length: width }, (_, ix) => new Vector(grid.length - 1 - ix, -width)),
      ...Array.from({ length: height }, (_, ix) => new Vector(ix * width, 1)),
      ...Array.from({ length: height }, (_, ix) => new Vector((ix + 1) * width - 1, -1)),
    ];
    const ends = starts.map((s) => this.countEnergisedSquares(s, grid, adjacencyMap, width));
    return ends.reduce((a, b) => Math.max(a, b));
  }
}
