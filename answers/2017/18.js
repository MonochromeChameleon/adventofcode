import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2017, 18, 2951, 7366);

    this.exampleInput({ filename: '18a', part1: 4 });
    this.exampleInput({ filename: '18b', part2: 3 });
  }

  get parser() {
    return Parsers.INSTRUCTIONS;
  }

  snd(tgt) {
    this.output.push(this.getValue(tgt));
  }

  set(tgt, val) {
    this[tgt] = this.getValue(val);
  }

  add(tgt, val) {
    this[tgt] = this.getValue(tgt) + this.getValue(val);
  }

  mul(tgt, val) {
    this[tgt] = this.getValue(tgt) * this.getValue(val);
  }

  mod(tgt, val) {
    this[tgt] = this.getValue(tgt) % this.getValue(val);
  }

  rcv(tgt) {
    if (this.getValue(tgt)) {
      this.recovered = this.output[this.output.length - 1];
    }
  }

  jgz(tgt, val) {
    if (this.getValue(tgt) > 0) {
      this.pointer += this.getValue(val) - 1;
    }
  }

  part1(instructions) {
    const breakFn = ({  recovered }) => recovered;
    const { recovered } = this.execute(instructions, {}, { breakFn });
    return recovered;
  }

  part2(instructions) {
    const interProcessComms = {
      p0: {
        stack: [],
        waiting: false,
        pointer: 0,
      },
      p1: {
        stack: [],
        waiting: false,
        pointer: 0,
      }
    }

    const snd = function(tgt) {
      interProcessComms[this.other].stack.push(this.getValue(tgt));
      interProcessComms[this.other].waiting = false;
    };

    const rcv = function(tgt) {
      const { stack, pointer } = interProcessComms[this.id];
      if (stack[pointer]) {
        this[tgt] = stack[pointer];
        interProcessComms[this.id].pointer += 1;
      } else {
        interProcessComms[this.id].waiting = true;
        this.pointer -= 1;
      }
    };

    const breakFn = ({ id }) => {
      const { stack, waiting, pointer } = interProcessComms[id];
      return waiting && !stack[pointer];
    }

    let s0 = { p: 0, id: 'p0', other: 'p1' };
    let s1 = { p: 1, id: 'p1', other: 'p0' };

    while (!interProcessComms.p1.waiting || !interProcessComms.p0.waiting) {
      s0 = this.execute(instructions, s0, { breakFn, snd, rcv });
      s1 = this.execute(instructions, s1, { breakFn, snd, rcv });
    }

    return interProcessComms.p0.stack.length;
  }
}
