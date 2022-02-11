import { QuestionBase, Parsers } from '../../../utils/question-base.js';

export class Assembunny extends QuestionBase {
  parseParams(line) {
    const [, ...args] = line.split(' ');
    return args.map((a) => (Number.isNaN(Number(a)) ? a : Number(a)));
  }

  get parser() {
    return Parsers.INSTRUCTIONS;
  }

  autoIncrementPointer(instruction) {
    return instruction !== 'jnz';
  }

  defaultParams({ a = 0, b = 0, c = 0, d = 0 } = {}) {
    return { a, b, c, d };
  }

  cpy(from, to) {
    if (!Number.isInteger(to)) {
      this[to] = Number.isInteger(from) ? from : this[from];
    }
  }

  inc(reg) {
    this[reg] += 1;
  }

  dec(reg) {
    this[reg] -= 1;
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
  }

  out(signal) {
    this.output.push(this[signal]);
  }
}
