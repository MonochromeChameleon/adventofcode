import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2017, 8, 3089, 5391);

    this.exampleInput({ filename: '8a', part1: 1, part2: 10 });
  }

  parseLine(line) {
    const [, register, action, amount, condReg, op, comparator] =
      /^(\w+) (\w+) (-?\d+) if ([^\s]+) ([^\s]+) (-?\d+)/.exec(line);
    return {
      register,
      action,
      amount: Number(amount),
      condReg,
      op,
      comparator: Number(comparator),
    };
  }

  test({ condReg, op, comparator }) {
    const val = this[condReg] || 0;
    switch (op) {
      case '>':
        return val > comparator;
      case '<':
        return val < comparator;
      case '>=':
        return val >= comparator;
      case '<=':
        return val <= comparator;
      case '==':
        return val === comparator;
      case '!=':
        return val !== comparator;
    }
  }

  inc({ register, amount }) {
    this[register] = (this[register] || 0) + amount;
    return this;
  }

  dec({ register, amount }) {
    this[register] = (this[register] || 0) - amount;
    return this;
  }

  part1(input) {
    const registers = input.reduce(
      (reg, { action, ...params }) => (this.test.call(reg, params) ? this[action].call(reg, params) : reg),
      {}
    );
    return Object.values(registers).reduce((a, b) => Math.max(a, b));
  }

  part2(input) {
    const { max: ans } = input.reduce(
      ({ max, reg }, { action, ...params }) => {
        if (!this.test.call(reg, params)) return { max, reg };
        const out = this[action].call(reg, params);
        const maxVal = Object.values(reg).reduce((a, b) => Math.max(a, b));
        return { max: Math.max(max, maxVal), reg: out };
      },
      { max: 0, reg: {} }
    );
    return ans;
  }
}
