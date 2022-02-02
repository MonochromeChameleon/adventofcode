import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2015, 19, 518, 200);
  }

  get parser() {
    return Parsers.MULTIPLE;
  }

  get parsers() {
    return {
      reactions: Parsers.MULTI_LINE_MAP,
      input: Parsers.SINGLE_LINE_STRING,
    };
  }

  parserGroup(line) {
    if (/=>/.test(line)) return 'reactions';
    return 'input';
  }

  map(line) {
    const [from, to] = line.split(' => ');
    return { from, to };
  }

  getReactions({ reactions, input }) {
    const out = new Set();
    reactions.forEach(({ from, to }) => {
      const parts = input.split(from);
      parts
        .slice(1)
        .forEach((_, i) => out.add([parts.slice(0, i + 1).join(from), parts.slice(i + 1).join(from)].join(to)));
    });
    return out;
  }

  doScience({ reactions, input }) {
    return reactions.reduce(
      ({ changes, result }, { from, to }) => {
        const split = result.split(to);
        return { result: split.join(from), changes: changes + split.length - 1 };
      },
      { changes: 0, result: input }
    );
  }

  part1({ reactions, input }) {
    return this.getReactions({ reactions, input }).size;
  }

  part2({ reactions, input }) {
    let steps = 0;
    let out = input;
    while (out !== 'e') {
      const { result, changes } = this.doScience({ reactions, input: out });
      out = result;
      steps += changes;
    }
    return steps;
  }
}
