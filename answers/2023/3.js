import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2023, 3, 540212, 87605697);

    this.exampleInput({ part1: 4361, part2: 467835 });
  }

  get parser() {
    return Parsers.GRID;
  }

  get adjacency() {
    return 8;
  }

  getValidDigitIndexes(row, width, adjacentDigitIndexes) {
    return adjacentDigitIndexes
      .filter((ix) => ix >= row * width && ix < (row + 1) * width)
      .map((ix) => ix % width)
      .filter((ix, ii, arr) => arr[ii + 1] !== ix + 1);
  }

  findNumbers(line, validIndexes) {
    const { vix: v, sofar: s, ...out } = line.split('')
      .reduce(({ sofar = '', vix, ...ooo }, c, ix) => {
      if (!/\d/.test(c)) {
        return vix && sofar ? ({ ...ooo, [vix]: sofar }) : ooo;
      }
      return validIndexes.includes(ix) ? { ...ooo, vix: ix, sofar: sofar + c } : { ...ooo, vix, sofar: sofar + c };
    }, {});
    return [...Object.values(out), (v ? s : undefined)].filter(Boolean).map(Number);
  }

  part1({ grid, adjacencyMap, lines, width }) {
    const symbols = grid.map((c, ix) => (c === '.' || /\d/.test(c)) ? undefined : ix).filter((ix) => ix !== undefined);
    const adjacentDigitIndexes = symbols.flatMap((ix) => adjacencyMap[ix]).filter((ix) => /\d/.test(grid[ix]));
    const partNumbers = lines.flatMap(
      (line, ix) => this.findNumbers(line, this.getValidDigitIndexes(ix, width, adjacentDigitIndexes)));
    return partNumbers.reduce((a, b) => a + b);
  }

  part2({ grid, adjacencyMap, lines, width }) {
    // 86460773 too low
    const maybeGears = grid.map((c, ix) => c === '*' ? ix : undefined).filter((ix) => ix !== undefined);
    const gearsWithNeighbours = maybeGears.map((ix) => {
      const adjacent = adjacencyMap[ix].filter((ad) => /\d/.test(grid[ad])).filter((ad, ii, arr) => arr[ii + 1] !== ad + 1);
      return { ix, adjacent }
    }).filter(({  adjacent }) => adjacent.length === 2);
    const neighbours = [... new Set(gearsWithNeighbours.flatMap(({ adjacent }) => adjacent))].sort((a, b) => a - b);
    const numbers = lines.flatMap((line, ix) => this.findNumbers(line, this.getValidDigitIndexes(ix, width, neighbours)));
    const numMap = Object.fromEntries(neighbours.map((n, ix) => [n, numbers[ix]]));

    return gearsWithNeighbours.map(({ adjacent: [a, b] }) => numMap[a] * numMap[b]).reduce((a, b) => a + b);
  }
}
