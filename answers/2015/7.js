import { QuestionBase, Parsers } from '../../utils/question-base.js';

class Circuit {
  constructor() {
    this.wires = { cache: {} };
  }

  addLine(line) {
    const [signal, name] = line.split(' -> ');

    Object.defineProperty(this.wires, name, {
      get() {
        if (this.cache[name]) {
          return this.cache[name];
        }

        const result = function iffe() {
          if (/^(\d+)$/.test(signal)) return Number(signal);
          if (/AND/.test(signal))
            return signal
              .split(' AND ')
              .map((n) => (/\d+/.test(n) ? Number(n) : this[n]))
              .reduce((a, b) => a & b);
          if (/OR/.test(signal))
            return signal
              .split(' OR ')
              .map((n) => this[n])
              .reduce((a, b) => a | b);
          if (/NOT/.test(signal)) return ~this[signal.replace('NOT ', '')];
          if (/LSHIFT/.test(signal))
            return signal
              .split(' LSHIFT ')
              .map((n, ix) => (ix ? Number(n) : this[n]))
              .reduce((a, b) => a << b);
          if (/RSHIFT/.test(signal))
            return signal
              .split(' RSHIFT ')
              .map((n, ix) => (ix ? Number(n) : this[n]))
              .reduce((a, b) => a >> b);
          return this[signal];
        }.bind(this)();

        this.cache[name] = result;
        return result;
      },
    });
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2015, 7, 956, 40149);
  }

  get parser() {
    return Parsers.REDUCE;
  }

  get reducer() {
    return Circuit;
  }

  part1(input) {
    return input.wires.a;
  }

  part2(input) {
    input.wires.cache = { b: this.answers.part1 };
    return input.wires.a;
  }
}
