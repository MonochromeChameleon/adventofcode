import { Parsers, QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2022, 5, 'TLNGFGMFN', 'FGLQJCMBD');

    this.exampleInput({ filename: '5a', part1: 'CMZ', part2: 'MCD' });
  }

  get parser() {
    return Parsers.MULTIPLE;
  }

  get parsers() {
    return {
      crates: Parsers.PARSER.withMappedProps({ parseLine: 'parseCrate' }),
      moves: Parsers.PARSER.withMappedProps({ parseLine: 'parseMove' })
    };
  }

  parserGroup(line) {
    return line.startsWith('move') ? 'moves' : 'crates';
  }

  parseCrate(line) {
    return line.split('').reduce((o, c, ix) => {
      if (ix % 4 !== 1) return o;
      return [...o, c];
    }, []);
  }

  parseMove(line) {
    const [, count, from, to] = /move (\d+) from (\d+) to (\d+)/.exec(line).map(Number);
    return { count, from: from - 1, to: to - 1 };
  }

  postParse({ crates, moves }) {
    const [labels, ...rows] = crates.reverse();
    const stacks = rows.reduce((sx, r) => r.reduce((o, c, ix) => {
      if (c.trim()) o[ix].push(c);
      return o;
    }, sx), Array.from({ length: labels.length }, () => []));

    return { stacks, moves };
  }

  get mutates() {
    return true;
  }

  applyMove(stacks, { count, from, to }, reverse = false) {
    const popped = Array.from({ length: count }).map(() => stacks[from].pop());
    stacks[to].push(...(reverse ? popped.reverse() : popped));
    return stacks;
  }

  part1({ stacks, moves }) {
    const endState = moves.reduce((s, m) => this.applyMove(s, m), stacks);
    return endState.map((s) => s.pop()).join('');
  }

  part2({ stacks, moves }) {
    const endState = moves.reduce((s, m) => this.applyMove(s, m, true), stacks);
    return endState.map((s) => s.pop()).join('');
  }
}
