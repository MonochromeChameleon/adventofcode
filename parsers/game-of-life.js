import { GridParser } from './grid.js';
import { buildAdjacencyMap } from '../utils/grid-utils.js';

export class GameOfLifeParser extends GridParser {
  get adjacency() {
    return 8;
  }

  generation(grid, adjacencyMap, nextFn = this.next.bind(this)) {
    return grid.map((value, ix) =>
      nextFn(
        value,
        adjacencyMap[ix].map((n) => grid[n]),
        ix,
        grid,
      ),
    );
  }

  generations(grid, count, adjacencyMap = this.input.adjacencyMap, nextFn = this.next.bind(this)) {
    const seen = [];
    let next = grid;
    let grd = grid.join('');
    for (let i = 0; i < count && !seen.includes(grd); i += 1) {
      seen.push(grd);
      next = this.generation(next, adjacencyMap, nextFn);
      grd = next.join('');
    }

    if (!seen.includes(grd)) return next;

    const repeatStart = seen.indexOf(grd);
    const repeatLength = seen.length - repeatStart;
    const numRepeats = ~~((count - repeatStart) / repeatLength);
    const outIndex = count - repeatLength * numRepeats;
    return seen[outIndex].split('');
  }

  untilRepeat(grid, adjacencyMap = this.input.adjacencyMap, nextFn = this.next.bind(this)) {
    const seen = [];
    let next = grid;
    let grd = grid.join('');
    while (!seen.includes(grd)) {
      seen.push(grd);
      next = this.generation(next, adjacencyMap, nextFn);
      grd = next.join('');
    }

    return next;
  }

  parseInput(lines) {
    const width = lines.reduce((max, line) => Math.max(max, line.length), 0);
    const grid = lines.map((line) => line.padEnd(width, ' ')).flatMap(this.m.parseLine.bind(this));
    const height = lines.length;
    const adjacencyMap = buildAdjacencyMap({ width, height, adjacency: this.adjacency });
    return { grid, height, width, adjacencyMap };
  }
}
