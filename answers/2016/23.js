import { Assembunny } from './assembunny/assembunny.js';

export class Question extends Assembunny {
  constructor() {
    super(2016, 23, 11760, 479008320);

    this.exampleInput({ filename: '23a', part1: 3 });
  }

  canOptimize() {
    return this.pointer === 4;
  }

  optimize() {
    this.a = this.b * this.d;
    this.c = 0;
    this.d = 0;
    this.pointer = 10;
  }

  part1(instructions) {
    return this.execute(instructions, { a: 7 }, instructions.length > 7).a;
  }

  part2(instructions) {
    return this.execute(instructions, { a: 12 }, true).a;
  }
}
