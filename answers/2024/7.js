import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2024, 7, 4555081946288, 227921760109726);

    this.exampleInput({ part1: 3749, part2: 11387 });
  }

  parseLine(line) {
    const [target, operands] = line.split(':').map((it) => it.trim());
    const values = operands.split(' ').map(Number);

    return { target: Number(target), values };
  }

  isAchievable(operators, target, value, next, ...values) {
    if (!next) return value === target;
    return operators(value, next).some((v) => this.isAchievable(operators, target, v, ...values));
  }

  part1(input) {
    const ops = (a, b) => [a + b, a * b];
    return input.filter(({ target, values }) => this.isAchievable(ops, target, ...values))
      .reduce((t, { target }) => t + target, 0);
  }

  part2(input) {
    const ops = (a, b) => [a + b, a * b, Number(`${a}${b}`)];
    return input.filter(({ target, values }) => this.isAchievable(ops, target, ...values))
      .reduce((t, { target }) => t + target, 0);
  }
}
