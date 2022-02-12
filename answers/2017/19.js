import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2017, 19, 'FEZDNIVJWT', 17200);

    this.exampleInput({ filename: '19a', part1: 'ABCDEF', part2: 38 });
  }

  get parser() {
    return Parsers.GRID;
  }

  runGrid({ grid, width, adjacencyMap }) {
    const start = grid.findIndex((it) => it === '|');
    let dir = width;
    let next = start + dir;
    const out = [];
    let steps = 1;
    while (next && next > 0 && next < grid.length) {
      const c = grid[next];
      steps += 1;

      if (!['|', '-', '+', ' '].includes(c)) {
        out.push(c);
      }

      if (c === '+' && (grid[next + dir] === ' ' || !grid[next + dir])) {
        const newNext = adjacencyMap[next].find((it) => it !== next - dir && grid[it] !== ' ');
        dir = newNext - next;
      }
      next = adjacencyMap[next].find((it) => it === next + dir && grid[it] !== ' ');
    }

    return { out: out.join(''), steps };
  }

  get result() {
    if (!this._result) {
      this._result = this.runGrid(this.input);
    }
    return this._result;
  }

  part1() {
    const { out } = this.result;
    return out;
  }

  part2(input) {
    const { steps } = this.result;
    return steps;
   }
}
