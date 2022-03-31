import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2020, 2, 393, 690);

    this.exampleInput({ part1: 2, part2: 1 });
  }

  get parser() {
    return Parsers.REGEX;
  }

  get regex() {
    return /^(\d+)-(\d+) (\w): (\w+)$/;
  }

  part1(input) {
    return input.filter(([min, max, char, password]) => {
      const count = password.split('').filter((c) => c === char).length;
      return count >= min && count <= max;
    }).length;
  }

  part2(input) {
    return input.filter(([pos1, pos2, char, password]) => {
      const isPos1 = password[pos1 - 1] === char;
      const isPos2 = password[pos2 - 1] === char;
      return isPos1 ^ isPos2;
    }).length;
  }
}
