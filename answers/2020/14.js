import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { allCombinations } from '../../utils/array-utils.js';

export class Question extends QuestionBase {
  constructor() {
    super(2020, 14, 16003257187056, 3219837697833);

    this.exampleInput({ part1: 165 });
    this.exampleInput({ part2: 208 });
  }

  get parser() {
    return Parsers.GROUP;
  }

  get groupDelimiter() {
    return /^mask/;
  }

  get retainDelimiter() {
    return true;
  }

  parseGroup([mask, ...assignments]) {
    const ass = assignments.map((a) => {
      const [, address, value] = a.match(/^mem\[(\d+)] = (\d+)$/).map(Number);
      return { address, value };
    });
    return { mask: mask.substring(7).split(''), assignments: ass };
  }

  part1(input) {
    const result = input.reduce((memory, { mask, assignments }) =>
        assignments.reduce((mem, { address, value }) => {
          const binaryValue = value.toString(2).padStart(mask.length, '0');
          const maskedValue = mask.map((bit, ix) => (bit === 'X' ? binaryValue[ix] : bit)).join('');
          return { ...mem, [address]: parseInt(maskedValue, 2) };
        }, memory),
      {}
    );

    return Object.values(result).reduce((sum, value) => sum + value, 0);
  }

  part2(input) {
    const result = input.reduce((memory, { mask, assignments }) => {
      const floaters = mask.map((bit, ix) => (bit === 'X' ? (mask.length - ix - 1) : -1)).filter((ix) => ix !== -1);
      const allFloaters = allCombinations(floaters).map((f) => f.map((p) => 2 ** p).reduce((a, b) => a + b, 0));

      return assignments.reduce((mem, { address, value }) => {
        const binaryAddress = address.toString(2).padStart(mask.length, '0');
        const maskedAddress = mask.map((bit, ix) => {
          switch (bit) {
            case '0':
              return binaryAddress[ix];
            case '1':
              return '1';
            case 'X':
              return '0';
          }
        }).join('');
        const baseAddress = parseInt(maskedAddress, 2);
        allFloaters.map((f) => f + baseAddress).forEach((address) => {
          mem[address] = value;
        });
        return mem;
      }, memory);
    }, {});

    return Object.values(result).reduce((sum, value) => sum + value, 0);
  }
}
