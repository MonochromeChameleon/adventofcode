import { IntcodeQuestion } from './intcode/intcode-question.js';

export class Question extends IntcodeQuestion {
  constructor() {
    super(2019, 2, 2894520, 9342);
  }

  execute(intcode, noun, verb) {
    return intcode.reset().override(1, noun).override(2, verb).run().lookup(0);
  }

  part1(input) {
    return this.execute(input, 12, 2);
  }

  part2(input) {
    const pairs = Array.from({ length: 100 }).flatMap((i, noun) =>
      Array.from({ length: 100 }).map((j, verb) => ({ noun, verb }))
    );

    const TARGET = 19690720;

    const { noun: n, verb: v } = pairs.find(({ noun, verb }) => this.execute(input, noun, verb) === TARGET);
    return 100 * n + v;
  }
}
