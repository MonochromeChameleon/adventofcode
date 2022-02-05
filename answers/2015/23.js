import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2015, 23, 307, 160);
  }

  parseLine(line) {
    const [command, arg1, arg2] = line.replace(',', '').split(' ');
    const register = command !== 'jmp' ? arg1 : undefined;
    const offset = Number(command !== 'jmp' ? arg2 : arg1) || undefined;

    return { command, register, offset };
  }

  execute(instructions, { a = 0, b = 0, pointer = 0 } = {}) {
    const state = { a, b, pointer };
    while (instructions[state.pointer]) {
      const { command, register, offset } = instructions[state.pointer];
      this[command].call(state, register, offset);
    }
    return state;
  }

  hlf(register) {
    this[register] = Math.floor(this[register] / 2);
    this.pointer += 1;
  }

  tpl(register) {
    this[register] *= 3;
    this.pointer += 1;
  }

  inc(register) {
    this[register] += 1;
    this.pointer += 1;
  }

  jmp(register, offset) {
    this.pointer += offset;
  }

  jie(register, offset) {
    const delta = this[register] % 2 === 0 ? offset : 1;
    this.pointer += delta;
  }

  jio(register, offset) {
    const delta = this[register] === 1 ? offset : 1;
    this.pointer += delta;
  }

  part1(instructions) {
    return this.execute(instructions).b;
  }

  part2(instructions) {
    return this.execute(instructions, { a: 1 }).b;
  }
}
