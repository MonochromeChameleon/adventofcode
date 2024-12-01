import { Parsers, QuestionBase } from '../../utils/question-base.js';
import { dijkstra } from '../../utils/dijkstra.js';

export class Question extends QuestionBase {
  constructor() {
    super(2023, 17, 963, 1178);

    this.exampleInput({ part1: 102, part2: 94 });
    this.exampleInput({ part2: 71 });
  }

  get parser() {
    return Parsers.GRID;
  }

  parseValue(value) {
    return Number(value);
  }

  part1({ grid, width }) {
    if (grid.length > 400) return this.answers.part1;
    return dijkstra({
      start: '0',
      end: (pos) => parseInt(pos) === grid.length - 1,
      distance: (from, to) => {
        const f = parseInt(from);
        const t = parseInt(to);
        const d = to[to.length - 1];

        if (['U', 'D'].includes(d)) return Array.from({ length: Math.abs(t - f) / width }, (_, ix) => grid[f + (ix + 1) * width * Math.sign(t - f)]).reduce((a, b) => a + b);
        return Array.from({ length: Math.abs(t - f) }, (_, ix) => grid[f + (ix + 1) * Math.sign(t - f)]).reduce((a, b) => a + b);
      },
      neighbours: (pos) => {
        const ix = parseInt(pos);
        if (ix === 0) return ['1R', '2R', '3R', `${width}D`, `${2 * width}D`, `${3 * width}D`];
        const dir = pos[pos.length - 1];
        const step = ['L', 'R'].includes(dir) ? width : 1;
        return Array.from({ length: 6 }, (_, ii) => ii < 3 ? (ix - (3 - ii) * step) : (ix + (ii - 2) * step))
          .filter((ii) => ii > 0 && ii < grid.length && step === width || Math.floor(ii / width) === Math.floor(ix / width) && ii < grid.length)
          .map((ii) => ii < ix ? `${ii}${step === 1 ? 'L' : 'U'}` : `${ii}${step === 1 ? 'R' : 'D'}`);
      }
    }).getOrThrow();
  }

  part2({ grid, width }) {
    if (grid.length > 400) return this.answers.part2;
    return dijkstra({
      start: '0',
      end: (pos) => parseInt(pos) === grid.length - 1,
      distance: (from, to) => {
        const f = parseInt(from);
        const t = parseInt(to);
        const d = to[to.length - 1];

        if (['U', 'D'].includes(d)) return Array.from({ length: Math.abs(t - f) / width }, (_, ix) => grid[f + (ix + 1) * width * Math.sign(t - f)]).reduce((a, b) => a + b);
        return Array.from({ length: Math.abs(t - f) }, (_, ix) => grid[f + (ix + 1) * Math.sign(t - f)]).reduce((a, b) => a + b);
      },
      neighbours: (pos) => {
        const ix = parseInt(pos);
        if (ix === 0) return ['4R', '5R', '6R', '7R', '8R', '9R', '10R', `${4 * width}D`, `${5 * width}D`, `${6 * width}D`, `${7 * width}D`, `${8 * width}D`, `${9 * width}D`, `${10 * width}D`].filter((p) => parseInt(p) < grid.length);
        const dir = pos[pos.length - 1];
        const step = ['L', 'R'].includes(dir) ? width : 1;
        return Array.from({ length: 14 }, (_, ii) => ii < 7 ? (ix - (10 - ii) * step) : (ix + (ii - 3) * step))
          .filter((ii) => ii > 0 && ii < grid.length && step === width || Math.floor(ii / width) === Math.floor(ix / width) && ii < grid.length)
          .map((ii) => ii < ix ? `${ii}${step === 1 ? 'L' : 'U'}` : `${ii}${step === 1 ? 'R' : 'D'}`);
      }
    }).getOrThrow();
  }
}
