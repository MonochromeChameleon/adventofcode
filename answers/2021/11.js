import { QuestionBase } from '../../utils/question-base.js';
import { countByValue } from '../../utils/count-by-value.js';
import { parseGrid } from '../../utils/grid-utils.js';

class Grid {
  constructor({ grid, adjacentIndexes }) {
    this.octopodes = grid;
    this.adjacencyMap = adjacentIndexes;
    this.steps = 0;
  }

  step() {
    let flashes = 0;
    this.steps += 1;
    this.octopodes = this.octopodes.map((value) => (value > 9 ? 1 : value + 1));
    while (this.octopodes.some((it) => it === 10)) flashes += this.cascade();
    return flashes;
  }

  cascade() {
    const flashIndexes = this.octopodes.reduce((acc, value, ix) => (value === 10 ? [...acc, ix] : acc), []);
    const energyBoosts = countByValue(flashIndexes.flatMap((ix) => this.adjacencyMap[ix]));

    flashIndexes.forEach((ix) => (this.octopodes[ix] = 11));
    for (let [ix, boost] of Object.entries(energyBoosts)) {
      if (this.octopodes[ix] < 10) {
        this.octopodes[ix] = Math.min(10, this.octopodes[ix] + boost);
      }
    }

    return flashIndexes.length;
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2021, 11, 1729, 237);

    this.exampleInput({ filename: 'testinputs/11', part1: 1656, part2: 195 });
  }

  parseInput(lines) {
    return new Grid(parseGrid({ lines, adjacency: 9 }));
  }

  part1(grid) {
    return Array.from({ length: 100 }).reduce((sum) => sum + grid.step(), 0);
  }

  part2(grid) {
    while (grid.step() < grid.octopodes.length) {}
    return grid.steps;
  }
}
