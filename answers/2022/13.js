import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2022, 13, 5555, 22852);

    this.exampleInput({ filename: '13a', part1: 13, part2: 140 });
  }

  get parser() {
    return Parsers.GROUP;
  }

  get groupSize() {
    return 2;
  }

  parseGroup([left, right]) {
    return { left: JSON.parse(left), right: JSON.parse(right) };
  }

  isInOrder({ left, right }) {
    if (!Array.isArray(left) && !Array.isArray(right)) {
      if (left < right) return true;
      if (left > right) return false;
      return undefined;
    }
    if (!Array.isArray(right)) return this.isInOrder({ left, right: [right] });
    if (!Array.isArray(left)) return this.isInOrder({ left: [left], right });

    if (!left.length && !right.length) return undefined;
    if (!left.length) return true;
    if (!right.length) return false;

    const [l, ...ls] = left;
    const [r, ...rs] = right;

    const cmp = this.isInOrder({ left: l, right: r });
    if (cmp !== undefined) return cmp;
    return this.isInOrder({ left: ls, right: rs });
  }

  part1(input) {
    return input.map(this.isInOrder.bind(this)).reduce((s, o, ix) => o ? (s + ix + 1) : s, 0);
  }

  part2(input) {
    const sorted = [[[2]], [[6]], ...input.flatMap(({ left, right }) => [left, right])]
      .sort((left, right) => this.isInOrder({ left, right }) ? -1 : 1);

    const two = sorted.findIndex((i) => JSON.stringify(i) === '[[2]]');
    const six = sorted.findIndex((i) => JSON.stringify(i) === '[[6]]');
    return (two + 1) * (six + 1);
  }
}
