import { QuestionBase } from '../utils/question-base.js';

class ALU {
  constructor() {
    this.instructions = []
  }

  add(line) {
    const [op, tgt, val] = line.split(' ');
    const num = Number(val);
    const value = (state) => Number.isNaN(num) ? state[val] : num;

    switch(op) {
      case 'inp':
        this.instructions.push([
          (state, input) => {
            state[tgt] = input;
            return state;
          }
        ])
        break;
      case 'add':
        this.instructions[this.instructions.length - 1].push((state) => {
          state[tgt] = state[tgt] + value(state);
          return state;
        });
        break;
      case 'mul':
        this.instructions[this.instructions.length - 1].push((state) => {
          state[tgt] = state[tgt] * value(state);
          return state;
        });
        break;
      case 'div':
        this.instructions[this.instructions.length - 1].push((state) => {
          state[tgt] = ~~(state[tgt] / value(state));
          return state;
        });
        break;
      case 'mod':
        this.instructions[this.instructions.length - 1].push((state) => {
          state[tgt] = state[tgt] % value(state);
          return state;
        });
        break;
      case 'eql':
        this.instructions[this.instructions.length - 1].push((state) => {
          state[tgt] = state[tgt] === value(state) ? 1 : 0;
          return state;
        });
    }
    return this;
  }

  execute(input, index, state = { w: 0, x: 0, y: 0, z: 0 }) {
    const [init, ...instructions] = this.instructions[index];
    return instructions.reduce((ste, instruction) => instruction(ste), init(state, input));
  }
}

export class Question extends QuestionBase {
  constructor (args) {
    super(24, 0, 69914999975369, 0, 14911675311114, args);
  }

  parseInput(lines) {
    return lines.reduce((alu, line) => alu.add(line), new ALU());
  }

  monad(number, alu) {
    const splitNum = `${number}`.split('').map(Number);
    if (splitNum.some(n => n === 0)) return -1;
    return splitNum.reduce((state, num, ix) => alu.execute(num, ix, { ...state }), { w: 0, x: 0, y: 0, z: 0 }).z;
  }

  part1 (alu) {
    if (this.useTestData) {
      return 0;
    }

    // by inspection:
    // (S-3)(R)91(N-5)(N)(Q)(P)(M)(M-2)(P-4)(Q-6)(R-3)(S)

    const s = 9;
    const r = 9;
    const n = 9;
    const q = 9;
    const p = 9;
    const m = 9;

    const value = Number(`${s-3}${r}91${n-5}${n}${q}${p}${m}${m-2}${p-4}${q-6}${r-3}${s}`);
    if (this.monad(value, alu) === 0) {
      return value;
    }
    return 0;
  }

  part2 (alu) {
    if (this.useTestData) {
      return 0;
    }

    // by inspection:
    // (S-3)(R)91(N-5)(N)(Q)(P)(M)(M-2)(P-4)(Q-6)(R-3)(S)

    const s = 4;
    const r = 4;
    const n = 6;
    const q = 7;
    const p = 5;
    const m = 3;

    const value = Number(`${s-3}${r}91${n-5}${n}${q}${p}${m}${m-2}${p-4}${q-6}${r-3}${s}`);
    if (this.monad(value, alu) === 0) {
      return value;
    }
    return 0;
  }
}
