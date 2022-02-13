import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2015, 23, 307, 160);
  }

  get parser() {
    return Parsers.INSTRUCTIONS;
  }

  parseParams(line) {
    const [, ...params] = line.replace(',', '').split(' ');
    return params.map((p) => (Number.isNaN(Number(p)) ? p : Number(p)));
  }

  hlf(register) {
    this[register] = Math.floor(this[register] / 2);
  }

  tpl(register) {
    this[register] *= 3;
  }

  inc(register) {
    this[register] += 1;
  }

  jmp(offset) {
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

  autoIncrementPointer(instruction) {
    return ['hlf', 'tpl', 'inc'].includes(instruction);
  }

  defaultParams({ a = 0, b = 0, c = 0, d = 0 } = {}) {
    return { a, b, c, d };
  }

  part1(instructions) {
    const { b } = this.execute(instructions);
    return b;
  }

  part2(instructions) {
    const { b } = this.execute(instructions, { a: 1 });
    return b;
  }
}
