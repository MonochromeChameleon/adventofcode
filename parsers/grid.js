import { Parser } from './parser.js';
import { buildAdjacencyMap } from '../utils/grid-utils.js';

export class GridParser extends Parser {
  get adjacency() {
    return 4;
  }

  parseLine(line, y) {
    return line.split(this.m.split).map((char, x) => this.m.parseValue(char, x, y));
  }

  parseInput(lines) {
    const width = lines.reduce((max, line) => Math.max(max, line.length), 0);
    const grid = lines.map((line) => line.padEnd(width, ' ')).flatMap(this.m.parseLine.bind(this));
    const height = lines.length;
    const adjacencyMap = buildAdjacencyMap({ width, height, adjacency: this.adjacency });
    return { grid, height, width, adjacencyMap };
  }
}
