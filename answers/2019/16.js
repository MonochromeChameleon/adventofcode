import { QuestionBase, Parsers } from '../../utils/question-base.js';

const BASE_PATTERN = [0, 1, 0, -1];

export class Question extends QuestionBase {
  constructor() {
    super(2019, 16, '74369033', '19903864');

    this.exampleInput({ input: '12345678', part1: '01029498' }, 4);
    this.exampleInput({ input: '80871224585914546619083218645595', part1: '24176176' });
    this.exampleInput({ input: '19617804207202209144916044189917', part1: '73745418' });
    this.exampleInput({ input: '69317163492948606335995924319873', part1: '52432133' });
  }

  get parser() {
    return Parsers.SINGLE_STRING;
  }

  phase(input) {
    return Array.from(input, (_, ix) => {
      let sum = 0;
      for (let iix = 0; iix < input.length; iix += 1) {
        const colRow = ~~((iix + 1) / (ix + 1));
        sum += Number(input[iix]) * BASE_PATTERN[colRow % 4];
      }
      return Math.abs(sum % 10);
    }).join('');
  }

  part1(input, phases = 100) {
    return Array.from({ length: phases })
      .reduce((sofar) => this.phase(sofar), input)
      .substr(0, 8);
  }

  part2(input) {
    const offset = Number(input.substr(0, 7));
    const expandedInput = Array.from({ length: 10000 })
      .map(() => input)
      .join('');

    const subInput = expandedInput.substr(offset);
    const reverseInput = subInput.split('').reverse().map(Number);

    for (let iter = 0; iter < 100; iter += 1) {
      for (let char = 1; char < reverseInput.length; char += 1) {
        reverseInput[char] = (reverseInput[char] + reverseInput[char - 1]) % 10;
      }
    }

    return reverseInput.slice(-8).reverse().join('');
  }
}
