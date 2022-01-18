import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2015, 18, 1061, 1006);
  }

  parseValue(value) {
    return value === '#';
  }

  get parser() {
    return Parsers.GRID;
  }

  get adjacency() {
    return 8;
  }

  animate({ grid, adjacencyMap, override = () => false }) {
    return grid.map((value, ix) => {
      if (override(ix)) return true;
      const neighboursOn = adjacencyMap[ix].map((ii) => grid[ii]).filter(it => it).length;
      return neighboursOn === 3 || (value && neighboursOn === 2);
    });
  }

  part1 ({ grid, adjacencyMap }) {
    return Array.from({ length: 100 }).reduce((state) => this.animate({ grid: state, adjacencyMap }), grid).filter(it => it).length;
  }

  part2 ({ grid, width, adjacencyMap }) {
    const override = (ix) => [0, width - 1, grid.length - width, grid.length - 1].includes(ix);
    return Array.from({ length: 100 }).reduce((state) => this.animate({ grid: state, adjacencyMap, override }), grid).filter(it => it).length;
  }
}
