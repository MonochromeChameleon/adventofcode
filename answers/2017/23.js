import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { PRIMES } from '../../utils/primes.js';

export class Question extends QuestionBase {
  constructor() {
    super(2017, 23, 4225, 905);
  }

  get parser() {
    return Parsers.INSTRUCTIONS;
  }

  set(register, value) {
    this[register] = this.getValue(value);
  }

  sub(register, value) {
    this[register] -= this.getValue(value);
  }

  mul(register, value) {
    this[register] *= this.getValue(value);
    this.muls = (this.muls || 0) + 1;
  }

  jnz(register, offset) {
    if (this.getValue(register) !== 0) {
      this.pointer += this.getValue(offset) - 1;
    }
  }

  hasFactors(value) {
    return PRIMES.filter((it) => it <= Math.sqrt(value)).some((it) => value % it === 0);
  }

  part1(input) {
    const { muls } = this.execute(input, {}, { defaultValue: 0 });
    return muls;
  }

  part2(input) {
    const { b } = this.execute(input, { a: 1 }, { defaultValue: 0, limit: 5 });
    return Array.from({ length: 1001 }, (_, i) => b + i * 17).filter((it) => this.hasFactors(it)).length;
  }
}
