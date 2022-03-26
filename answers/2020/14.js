import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2020, 14, 16003257187056);

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
    return { mask: mask.substring(6).split(''), assignments: ass };
  }

  part1(input) {
    const result = input.reduce(
      (memory, { mask, assignments }) =>
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
    const result = input.reduce(
      ({ mask, memory }, line) => {
        if (line.startsWith('mask')) return { mask: line.substring(6).split(''), memory };
        const [, address, value] = line.match(/^mem\[(\d+)] = (\d+)$/).map(Number);
        const binaryValue = value.toString(2).padStart(mask.length, '0');
        const maskedValue = mask.map((bit, ix) => (bit === 'X' ? binaryValue[ix] : bit)).join('');
        return { mask, memory: { ...memory, [address]: parseInt(maskedValue, 2) } };
      },
      { mask: [], memory: {} }
    );

    return Object.values(result.memory).reduce((sum, value) => sum + value, 0);
  }
}
