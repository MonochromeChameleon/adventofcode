import { Assembunny } from './assembunny/assembunny.js';

export class Question extends Assembunny {
  constructor() {
    super(2016, 25, 180);
  }

  is010101(a, instructions) {
    let result = true;

    const breakFn = (state) => {
      if (!state.output.length) return false;
      if (state.output.length === 1) {
        if (state.output[0] === 0) return false;
        result = false;
        return true;
      }

      result = state.output[state.output.length - 1] ^ state.output[state.output.length - 2];
      return !result;
    };

    this.execute(instructions, { a }, { optimize: true, limit: 1000, breakFn });
    return result;
  }

  canOptimize() {
    return this.pointer === 3 || this.pointer === 12;
  }

  optimize() {
    if (this.pointer === 3) {
      this.d += this.b * this.c;
      this.c = 0;
      this.b = 0;
      this.pointer = 8;
    } else if (this.pointer === 12) {
      this.a += ~~(this.b / 2);
      this.c = 2 - (this.b % 2);
      this.b = 0;
      this.pointer = 20;
    }
  }

  part1(instructions) {
    let a = 0;
    while (!this.is010101(a, instructions)) {
      a += 1;
    }
    return a;
  }
}
