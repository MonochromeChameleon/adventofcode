import { aStarSearch } from './a-star.js';
import { buildAdjacencyMap } from './grid-utils.js';

export class Maze {
  constructor({ squares, height, width }) {
    this.squares = squares;
    this.height = height;
    this.width = width;
    this.adjacencyMap = buildAdjacencyMap({ width, height, adjacency: 4 });
  }

  get nonStandardSquares() {
    return this.squares.filter((square) => square !== '.' && square !== '#' && square !== ' ');
  }

  find(char) {
    return this.squares.indexOf(char);
  }

  manhattan(start, end) {
    const sx = start % this.width;
    const sy = ~~(start / this.width);
    const ex = end % this.width;
    const ey = ~~(end / this.width);

    return Math.abs(sx - ex) + Math.abs(sy - ey);
  }

  neighbours(square, blockages = []) {
    return this.adjacencyMap[square]
      .filter((ix) => this.squares[ix] !== '#' && this.squares[ix] !== ' ')
      .filter((ix) => !blockages.includes(ix));
  }

  route(start, end, blockages = [], output = 'route') {
    const startIndex = Number.isInteger(start) ? start : this.find(start);
    const endIndex = Number.isInteger(end) ? end : this.find(end);

    return aStarSearch({
      start: startIndex,
      end: endIndex,
      h: (ix) => this.manhattan(ix, endIndex),
      neighbours: (ix) => this.neighbours(ix, blockages),
      searchSpaceSize: this.squares.length,
      output,
    });
  }

  distance(start, end, blockages = []) {
    return this.route(start, end, blockages, 'distance');
  }

  /* c8 ignore next 5 */
  toString() {
    return Array.from({ length: this.height }, (_, row) =>
      this.squares.slice(row * this.width, (row + 1) * this.width).join(''),
    ).join('\n');
  }
}
