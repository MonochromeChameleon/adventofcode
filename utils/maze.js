import { aStarSearch } from './a-star.js';
import { buildAdjacencyMap } from './grid-utils.js';

export class Maze {
  constructor({ squares, height, width }) {
    this.squares = squares;
    this.height = height;
    this.width = width;
    this.adjacencyMap = buildAdjacencyMap({ width, height, adjacency: 4 });

    this.nonStandardSquares = this.squares.filter((square) => square !== '.' && square !== '#');
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

  neighbours(square) {
    return this.adjacencyMap[square].filter((ix) => this.squares[ix] !== '#');
  }

  route(start, end) {
    const startIndex = Number.isInteger(start) ? start : this.find(start);
    const endIndex = Number.isInteger(end) ? end : this.find(end);

    return aStarSearch({
      start: startIndex,
      goal: endIndex,
      h: (ix) => this.manhattan(ix, endIndex),
      neighbours: (ix) => this.neighbours(ix),
      searchSpaceSize: this.squares.length,
    });
  }

  distance(start, end) {
    return this.route(start, end).length - 1;
  }

  toString() {
    return Array.from({ length: this.height }, (_, row) =>
      this.squares.slice(row * this.width, (row + 1) * this.width).join('')
    ).join('\n');
  }
}
