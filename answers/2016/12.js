import { Assembunny } from './assembunny/assembunny.js';

export class Question extends Assembunny {
  constructor() {
    super(2016, 12, 318083, 9227737);

    this.exampleInput({ filename: '12a', part1: 42 });
  }

  part1(instructions) {
    return this.execute(instructions).a;
  }

  part2(instructions) {
    return this.execute(instructions, { c: 1 }).a;
  }
}
