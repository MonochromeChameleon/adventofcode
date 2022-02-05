import { QuestionBase } from '../../../utils/question-base.js';

export class Assembunny extends QuestionBase {
  parseLine(line) {
    const [instruction, ...args] = line.split(' ');
    const params = args.map((a) => (Number.isNaN(Number(a)) ? a : Number(a)));
    return { instruction, params };
  }

  execute(
    instructions,
    { a = 0, b = 0, c = 0, d = 0 } = {},
    { optimize = false, limit = Infinity, breakFn = () => false } = {}
  ) {
    const state = {
      a,
      b,
      c,
      d,
      pointer: 0,
      instructions: JSON.parse(JSON.stringify(instructions)),
      get instruction() {
        return this.instructions[this.pointer];
      },
      output: [],
    };

    let count = 0;

    while (state.instruction && count < limit && !breakFn(state)) {
      if (optimize && this.canOptimize.call(state)) {
        this.optimize.call(state);
      } else {
        const { instruction, params } = state.instruction;
        this[instruction].call(state, ...params);
      }
      count += 1;
    }
    return state;
  }

  cpy(from, to) {
    if (!Number.isInteger(to)) {
      this[to] = Number.isInteger(from) ? from : this[from];
    }
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
    const val = Number.isInteger(reg) ? reg : this[reg];
    const offset = Number.isInteger(step) ? step : this[step];
    this.pointer += val === 0 ? 1 : offset;
  }

  tgl(offset) {
    const point = this[offset];
    const instruction = this.instructions[this.pointer + point];
    const findNewType = (type) => {
      switch (type) {
        case 'jnz':
          return 'cpy';
        case 'cpy':
          return 'jnz';
        case 'inc':
          return 'dec';
        default:
          return 'inc';
      }
    };
    if (instruction) instruction.instruction = findNewType(instruction.instruction);
    this.pointer += 1;
  }

  out(signal) {
    this.output.push(this[signal]);
    this.pointer += 1;
  }
}
