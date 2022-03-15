import { Parsers } from '../../utils/question-base.js';
import { InstructionSet } from './instruction-set/instruction-set.js';
import { primeFactors } from '../../utils/primes.js';
import { allCombinations } from '../../utils/array-utils.js';

export class Question extends InstructionSet {
  constructor() {
    super(2018, 19, 1256, 16137576);

    this.exampleInput({ part1: 7 });
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
    const endState = this.execute(instructions, { ip, 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    return endState[0];
  }

  part2({ ip: [[ip]], instructions }) {
    const endState = this.execute(
      instructions,
      {
        ip,
        0: 1,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
      { limit: 20 }
    );
    const tgt = endState['5'];
    const [a, b, c, d] = primeFactors(tgt);
    const combinations = allCombinations([a, b, c, d]);
    const divisors = combinations.map((z) => z.reduce((x, y) => x * y, 1));
    const uniqueDivisors = [...new Set(divisors)];
    return uniqueDivisors.reduce((x, y) => x + y);
  }
}
