import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2017, 19, 'FEZDNIVJWT', 17200);

    this.exampleInput({ filename: '19a', part1: 'ABCDEF', part2: 38 });
  }

  get parser() {
    return Parsers.GRID;
  }

  findDir(grid, next, dir, adjacencyMap) {
    if (grid[next] !== '+') return dir;
    if (grid[next + dir] && grid[next + dir] !== ' ') return dir;

    const prev = next - dir;
    const newNext = adjacencyMap[next].find((it) => it !== prev && grid[it] !== ' ');
    return newNext - next;
  }

  findNext(next, dir, adjacencyMap) {
    return adjacencyMap[next].find((it) => it === next + dir);
  }

  runGrid({ grid, width, adjacencyMap }) {
    const start = grid.findIndex((it) => it === '|');
    let dir = width;
    let next = start + dir;
    const out = [];
    let steps = 1;
    while (next && next > 0 && next < grid.length && grid[next] !== ' ') {
      const c = grid[next];
      if (!['|', '-', '+', ' '].includes(c)) out.push(c);
      steps += 1;

      dir = this.findDir(grid, next, dir, adjacencyMap);
      next = this.findNext(next, dir, adjacencyMap);
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

  part2() {
    const { steps } = this.result;
    return steps;
  }
}
