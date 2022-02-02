import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2016, 12, 318083, 9227737);

    this.exampleInput({ filename: '12a', part1: 42 });
  }

  map(line) {
    const [instruction, ...args] = line.split(' ');
    const params = args.map((a) => (Number.isNaN(Number(a)) ? a : Number(a)));
    return { instruction, params };
  }

  get parser() {
    return Parsers.MULTI_LINE_MAP;
  }

  execute(instructions, { a = 0, b = 0, c = 0, d = 0 } = {}) {
    const state = { a, b, c, d, pointer: 0 };

    while (instructions[state.pointer]) {
      const { instruction, params } = instructions[state.pointer];
      this[instruction].call(state, ...params);
    }
    return state;
  }

  cpy(from, to) {
    this[to] = Number.isInteger(from) ? from : this[from];
    this.pointer += 1;
  }

  inc(reg) {
    this[reg] += 1;
    this.pointer += 1;
  }

  dec(reg) {
    this[reg] -= 1;
    this.pointer += 1;
  }

  jnz(reg, step) {
    this.pointer += this[reg] === 0 ? 1 : step;
  }

  part1(instructions) {
    return this.execute(instructions).a;
  }

  part2(instructions) {
    return this.execute(instructions, { c: 1 }).a;
  }
}
