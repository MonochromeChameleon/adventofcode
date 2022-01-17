import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2015, 3, 2572, 2631);

    this.exampleInput({ input: '>', part1: 2 });
    this.exampleInput({ input: '^v', part2: 3 });
    this.exampleInput({ input: '^>v<', part1: 4, part2: 3 });
    this.exampleInput({ input: '^v^v^v^v^v', part1: 2, part2: 11 });
  }

  get parser() {
    return Parsers.SINGLE_LINE_SPLIT;
  }

  get split() {
    return '';
  }

  part1 (input) {
    return Object.values(input.reduce(([lastStop, ...stops], dir) => {
      const [x, y] = lastStop.split(':').map(Number);
      const dx = (dir === '^' || dir === 'v') ? 0 : (dir === '<' ? -1 : 1);
      const dy = (dir === '>' || dir === '<') ? 0 : (dir === 'v' ? 1 : -1);
      return [`${x + dx}:${y + dy}`, lastStop, ...stops];
    }, ['0:0']).reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {})).length;
  }

  part2 (input) {
    const next = (x, y, d) => {
      const dx = (d === '^' || d === 'v') ? 0 : (d === '<' ? -1 : 1);
      const dy = (d === '>' || d === '<') ? 0 : (d === 'v' ? 1 : -1);
      return `${x + dx}:${y + dy}`;
    }

    return Object.values(Array.from({ length: input.length / 2 }).reduce(([lastState, ...states], _, ix) => {
      const [sx, sy, rx, ry] = lastState.split(/[:%]/).map(Number);
      const s = next(sx, sy, input[ix * 2]);
      const r = next(rx, ry, input[ix * 2 + 1]);
      return [`${s}%${r}`, lastState, ...states];
    }, ['0:0%0:0']).reduce((acc, curr) => {
      curr.split('%').forEach(c => {
        acc[c] = (acc[c] || 0) + 1;
      });
      return acc;
    }, {})).length;
  }
}
