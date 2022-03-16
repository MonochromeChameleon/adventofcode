import { IntcodeQuestion } from './intcode/intcode-question.js';

export class Question extends IntcodeQuestion {
  constructor() {
    super(2019, 2, 2894520, 9342);

    this.exampleInput({ input: '1,9,10,3,2,3,11,0,99,30,40,50', part1: 3500 }, 9, 10);
    this.exampleInput({ input: '1,0,0,0,99', part1: 2 }, 0, 0);
    this.exampleInput({ input: '2,3,0,3,99', part1: 2 }, 3, 0);
    this.exampleInput({ input: '2,4,4,5,99,0', part1: 2 }, 4, 4);
    this.exampleInput({ input: '1,1,1,4,99,5,6,0,99', part1: 30 }, 1, 1);
  }

  execute(intcode, noun, verb) {
    return intcode.reset().override(1, noun).override(2, verb).run().lookup(0);
  }

  part1(input, noun = 12, verb = 2) {
    return this.execute(input, noun, verb);
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
