import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2017, 9, 11846, 6285);

    this.exampleInput({ input: '{}', part1: 1 });
    this.exampleInput({ input: '{{{}}}', part1: 6 });
    this.exampleInput({ input: '{{},{}}', part1: 5 });
    this.exampleInput({ input: '{{{},{},{{}}}}', part1: 16 });
    this.exampleInput({ input: '{<a>,<a>,<a>,<a>}', part1: 1 });
    this.exampleInput({ input: '{{<ab>},{<ab>},{<ab>},{<ab>}}', part1: 9 });
    this.exampleInput({ input: '{{<!!>},{<!!>},{<!!>},{<!!>}}', part1: 9 });
    this.exampleInput({ input: '{{<a!>},{<a!>},{<a!>},{<ab>}}', part1: 3 });

    this.exampleInput({ input: '<>', part2: 0 });
    this.exampleInput({ input: '<random characters>', part2: 17 });
    this.exampleInput({ input: '<<<<>', part2: 3 });
    this.exampleInput({ input: '<{!>}>', part2: 2 });
    this.exampleInput({ input: '<!!>', part2: 0 });
    this.exampleInput({ input: '<!!!>>', part2: 0 });
    this.exampleInput({ input: '<{o"i!a,<{i<a>', part2: 10 });
  }

  get parser() {
    return Parsers.SINGLE_LINE_SPLIT;
  }

  processGarbage(input) {
    return input.reduce(
      ({ score, depth, garbage, ignore, trash }, char) => {
        if (ignore) return { score, depth, garbage, ignore: false, trash };
        if (char === '!') return { score, depth, garbage, ignore: true, trash };
        if (char === '>') return { score, depth, garbage: false, ignore, trash };
        if (garbage) return { score, depth, garbage, ignore, trash: trash + 1 };
        if (char === '<') return { score, depth, garbage: true, ignore, trash };
        if (char === '{') return { score: score + depth, depth: depth + 1, garbage, ignore, trash };
        if (char === '}') return { score, depth: depth - 1, garbage, ignore, trash };
        return { score, depth, garbage, ignore, trash };
      },
      { score: 0, depth: 1, garbage: false, ignore: false, trash: 0 },
    );
  }

  part1(input) {
    const { score } = this.processGarbage(input);
    return score;
  }

  part2(input) {
    const { trash } = this.processGarbage(input);
    return trash;
  }
}
