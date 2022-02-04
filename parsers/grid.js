import { Parser } from './parser.js';
import { buildAdjacencyMap } from '../utils/grid-utils.js';

export class GridParser extends Parser {
  parseLine(line) {
    return line.split(this.split).map(this.parseValue.bind(this));
  }

  parseInput(lines) {
    const grid = lines.flatMap(this.parseLine.bind(this));
    const height = lines.length;
    const width = grid.length / height;
    const adjacencyMap = buildAdjacencyMap({ width, height, adjacency: this.adjacency });
    return { grid, height, width, adjacencyMap };
  }
}
