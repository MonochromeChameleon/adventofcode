import { QuestionBase } from '../utils/question-base.js';
import { parseGrid, adjacentIndices } from '../utils/grid-utils.js';

export class Question extends QuestionBase {
  constructor (args) {
    super(15, 40, 410, 315, 2809, args);
  }

  parseLine(line) {
    return Number(line);
  }

  parseInput(lines) {
    return parseGrid({ lines, adjacency: 4 })
  }

  reconstruct_path(cameFrom, current) {
    const total_path = [current];
    while (current in cameFrom) {
      current = cameFrom[current]
      total_path.unshift(current)
    }
    return total_path
  }

  aStarSearch(width, d) {
    const start = 0;
    const goal = (width * width) - 1;
    const h = (index) => {
      const row = ~~(index / width);
      const col = index % width;

      return Math.abs(row - width - 1) + Math.abs(col - width - 1);
    }

    const openSet = new Set([start]);
    const cameFrom = {}

    const gScore = Array.from({ length: goal }).fill(Infinity);
    gScore[start] = 0;

    const fScore = Array.from({ length: goal }).fill(Infinity);
    fScore[start] = 0;

    while (openSet.size) {
      const current = [...openSet].sort((a, b) => fScore[a] - fScore[b])[0];
      if (current === goal) {
        return this.reconstruct_path(cameFrom, current)
      }

      openSet.delete(current);

      for (const neighbour of adjacentIndices(current, width, 4)) {
        const tentative_gScore = gScore[current] + d(current, neighbour);
        if (tentative_gScore >= gScore[neighbour]) continue;
        cameFrom[neighbour] = current;
        gScore[neighbour] = tentative_gScore;
        fScore[neighbour] = gScore[neighbour] + h(neighbour);
        openSet.add(neighbour);
      }
    }

    throw new Error('No path found');
  }

  part1 ({ grid, width, adjacentIndexes }) {
    const [start, ...path] = this.aStarSearch(width, (_, ix) => grid[ix]);
    return path.reduce((acc, ix) => acc + grid[ix], 0);
  }

  part2 ({ grid, width }) {

    const fiveW = width * 5;
    const getGridRisk = (index) => {
      const row = ~~(index / fiveW);
      const col = index % fiveW;
      const sourceRow = row % width;
      const sourceCol = col % width;
      const sourceIndex = sourceRow * width + sourceCol;

      const rowRepeat = ~~(row / width);
      const colRepeat = ~~(col / width);
      const increment = rowRepeat + colRepeat;

      return (grid[sourceIndex] + increment) % 9 || 9;
    }

    const [start, ...path] = this.aStarSearch(fiveW, getGridRisk);
    return path.reduce((acc, ix) => acc + getGridRisk(ix), 0);
  }
}
