import { Parsers, QuestionBase } from '../../utils/question-base.js';
import { mapBy } from '../../utils/count-by-value.js';
import { lcm } from '../../utils/number-utils.js';

export class Question extends QuestionBase {
  constructor() {
    super(2023, 8, 12737, 9064949303801);

    this.exampleInput({ part1: 2 });
    this.exampleInput({ part1: 6 });
    this.exampleInput({ part2: 6 });
  }

  get parser() {
    return Parsers.TOP_LINE_AND_CONTEXT;
  }

  parseTop(line) {
    return line.split('').map((c) => (c === 'L' ? 'left' : 'right'));
  }

  parseLine(line) {
    const [node, left, right] = line.split(/\W+/);
    return { node, left, right };
  }

  postParse({ first, context }) {
    const map = mapBy(context, ({ node }) => node);
    return { steps: first, map };
  }

  countSteps(from, to, steps, map) {
    let next = from;
    let i = 0;
    while (next !== to) {
      next = map[next][steps[i % steps.length]];
      i += 1;
    }
    return i;
  }

  findCycles(from, steps, map) {
    let i = 0;
    let next = from;
    const visited = {};
    while (true) {
      const ii = i;
      visited[next] ||= [];
      const cycle = visited[next].find((v) => (ii - v) % steps.length === 0);
      if (cycle) return ii - cycle;
      visited[next].push(ii);
      next = map[next][steps[ii % steps.length]];
      i += 1;
    }
  }

  part1({ steps, map }) {
    return this.countSteps('AAA', 'ZZZ', steps, map);
  }

  part2({ steps, map }) {
    return Object.keys(map)
      .filter((k) => /A$/.test(k))
      .map((s) => this.findCycles(s, steps, map))
      .reduce((a, b) => lcm(a, b));
  }
}
