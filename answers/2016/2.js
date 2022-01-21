import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2016, 2, 38961, '46C92');

    this.exampleInput({ input: ['ULL', 'RRDDD', 'LURDL', 'UUUUD'], part1: 1985, part2: '5DB3' });
  }

  get parser() {
    return Parsers.MULTI_LINE_SPLIT;
  }

  part1(instructions) {
    const execute = (digit, step) => {
      switch (step) {
        case 'U':
          return digit <= 3 ? digit : digit - 3;
        case 'D':
          return digit >= 7 ? digit : digit + 3;
        case 'L':
          return digit % 3 === 1 ? digit : digit - 1;
        case 'R':
          return digit % 3 === 0 ? digit : digit + 1;
        default:
          throw new Error(`Unknown step: ${step}`);
      }
    };

    const result = instructions.reduce((digits, instruction) => {
      const previous = digits[digits.length - 1] || 5;
      const next = instruction.reduce(execute, previous);
      return [...digits, next];
    }, []);

    return Number(result.join(''));
  }

  part2(instructions) {
    const execute = (digit, step) => {
      switch (step) {
        case 'U':
          if ([1, 2, 4, 5, 9].includes(digit)) return digit;
          if (digit === 3) return 1;
          if (digit === 'D') return 'B';
          if (Number.isInteger(digit)) return digit - 4;
          return ['A', 'B', 'C'].indexOf(digit) + 6;
        case 'D':
          if ([5, 9, 'A', 'C', 'D'].includes(digit)) return digit;
          if (digit === 'B') return 'D';
          if (digit === 1) return 3;
          if (digit < 5) return digit + 4;
          return ['A', 'B', 'C'][digit - 6];
        case 'L':
          if ([1, 2, 5, 'A', 'D'].includes(digit)) return digit;
          if (Number.isInteger(digit)) return digit - 1;
          if (digit === 'B') return 'A';
          return 'B';
        case 'R':
          if ([1, 4, 9, 'C', 'D'].includes(digit)) return digit;
          if (Number.isInteger(digit)) return digit + 1;
          if (digit === 'A') return 'B';
          return 'C';
        default:
          throw new Error(`Unknown step: ${step}`);
      }
    };

    const result = instructions.reduce((digits, instruction) => {
      const previous = digits[digits.length - 1] || 5;
      const next = instruction.reduce(execute, previous);
      return [...digits, next];
    }, []);

    return result.join('');
  }
}
