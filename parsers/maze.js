import { GridParser } from './grid.js';
import { Maze } from '../utils/maze.js';

export class MazeParser extends GridParser {
  parseValue(value) {
    return value;
  }

  get adjacency() {
    return 0;
  }

  parseInput(lines) {
    const { grid, height, width, adjacencyMap } = super.parseInput.call(this, lines);
    return new Maze({ squares: grid, height, width, adjacencyMap });
  }
}
