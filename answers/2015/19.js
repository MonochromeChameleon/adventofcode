import { QuestionBase, Parsers } from '../../utils/question-base.js';

class Chemistry {
  constructor() {
    this.reactions = [];
  }

  addLine(line) {
    const [from, to] = line.split(' => ');
    this.reactions.push({ from, to });
    return this;
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2015, 19, 518, 200);
  }

  get parser() {
    return Parsers.MULTIPLE;
  }

  get parsers() {
    return {
      chemistry: Parsers.REDUCE,
      input: Parsers.SINGLE_LINE_STRING,
    };
  }

  parserGroup(line) {
    if (/=>/.test(line)) return 'chemistry';
    return 'input';
  }

  get reducer() {
    return Chemistry;
  }

  getReactions({ chemistry, input }) {
    const out = new Set();
    chemistry.reactions.forEach(({ from, to }) => {
      const parts = input.split(from);
      parts.slice(1).forEach((_, i) => out.add([parts.slice(0, i + 1).join(from), parts.slice(i + 1).join(from)].join(to)));
    });
    return out;
  }

  doScience({ chemistry, input }) {
    return chemistry.reactions.reduce(({ changes, result }, { from, to }) => {
      const split = result.split(to);
      return { result: split.join(from), changes: changes + split.length - 1 };
    }, { changes: 0, result: input });
  }

  part1({ chemistry, input }) {
    return this.getReactions({ chemistry, input }).size;
  }

  part2({ chemistry, input }) {
    let steps = 0;
    let out = input;
    while (out !== 'e') {
      const { result, changes } = this.doScience({ chemistry, input: out });
      out = result;
      steps += changes;
    }
    return steps;
  }
}
