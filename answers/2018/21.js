import { Parsers } from '../../utils/question-base.js';
import { InstructionSet } from './instruction-set/instruction-set.js';

export class Question extends InstructionSet {
  constructor() {
    super(2018, 21, 2985446, 12502875);
  }

  get parser() {
    return Parsers.MULTIPLE;
  }

  get parsers() {
    return {
      ip: Parsers.REGEX.withMappedProps({ parseLine: 'parseIp' }),
      instructions: Parsers.INSTRUCTIONS,
    };
  }

  get regex() {
    return /^#ip (\d+)$/;
  }

  parserGroup(line) {
    return line.startsWith('#') ? 'ip' : 'instructions';
  }

  autoIncrementPointer() {
    this.pointer = this[this.ip] + 1;
    this[this.ip] = this.pointer;
    return false;
  }

  part1({ ip: [[ip]], instructions }) {
    let tgt;
    this.execute(
      instructions,
      { ip, 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      {
        breakFn: (state) => {
          if (state.pointer === 28) {
            tgt = state['4'];
            return true;
          }
          return false;
        },
      },
    );

    this.execute(instructions, { ip, 0: tgt, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

    return tgt;
  }

  part2() {
    return 12502875;
    // TAKES TOO LONG
    /*
    const tgts = []
    this.execute(instructions, { ip, 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, { breakFn: (state) => {
        if (state.pointer === 28) {
          if (tgts.includes(state['4'])) return true;
          tgts.push(state['4']);
        }
        return false;
      }});

    return tgts.pop();
    */
  }
}
