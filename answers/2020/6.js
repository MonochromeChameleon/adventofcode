import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2020, 6, 6551, 3358);

    this.exampleInput({ part1: 11, part2: 6 });
  }

  get parser() {
    return Parsers.GROUP;
  }

  get groupDelimiter() {
    return /^$/;
  }

  get retainEmptyLines() {
    return true;
  }

  part1(groups) {
    return groups.map((g) => [...new Set(g.flatMap((l) => l.split('')))].length).reduce((a, b) => a + b);
  }

  part2(groups) {
    return groups
      .map(([g0, ...g]) => g0.split('').filter((q) => g.every((gg) => gg.includes(q))).length)
      .reduce((a, b) => a + b);
  }
}
