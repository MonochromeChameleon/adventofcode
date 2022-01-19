import { QuestionBase, Parsers } from '../../utils/question-base.js';

class Computer {
  constructor() {
    this.instructions = [];
  }

  addLine(line) {
    const [command, arg1, arg2] = line.replace(',', '').split(' ');
    const register = command !== 'jmp' ? arg1 : undefined;
    const offset = Number(command !== 'jmp' ? arg2 : arg1) || undefined;

    this.instructions.push({ command, register, offset });
  }

  hlf(register) {
    this[register] = Math.floor(this[register] / 2);
    this.pointer++;
  }

  tpl(register) {
    this[register] = this[register] * 3;
    this.pointer++;
  }

  inc(register) {
    this[register]++;
    this.pointer++;
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

  run({ a = 0, b = 0, pointer = 0} = {}) {
    const state = { a, b, pointer };
    while (this.instructions[state.pointer]) {
      const { command, register, offset } = this.instructions[state.pointer];
      this[command].call(state, register, offset);
    }
    return state;
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2015, 23, 307, 160);
  }

  get parser() {
    return Parsers.REDUCE;
  }

  get reducer() {
    return Computer;
  }

  part1(computer) {
    return computer.run().b;
  }

  part2(computer) {
    return computer.run({ a: 1 }).b;
  }
}
