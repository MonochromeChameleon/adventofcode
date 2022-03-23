import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2020, 1, 259716, 120637440);

    this.exampleInput({ part1: 514579, part2: 241861950 });
  }

  get parser() {
    return Parsers.ONE_NUMBER_PER_LINE;
  }

  findSum(input, target, count) {
    if (count === 1) return input.find((i) => i === target);
    return input.reduce((out, i, ix) => out || i * this.findSum(input.slice(ix + 1), target - i, count - 1), undefined);
  }

  part1(input) {
    return this.findSum(input, 2020, 2);
  }

  part2(input) {
    return this.findSum(input, 2020, 3);
  }
}
