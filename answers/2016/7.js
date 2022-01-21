import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2016, 7, 105, 258);

    this.exampleInput({ input: 'abba[mnop]qrst', part1: 1 });
    this.exampleInput({ input: 'abcd[bddb]xyyx', part1: 0 });
    this.exampleInput({ input: 'aaaa[qwer]tyui', part1: 0 });
    this.exampleInput({ input: 'ioxxoj[asdfgh]zxcvbn', part1: 1 });

    this.exampleInput({ input: 'aba[bab]xyz', part2: 1 });
    this.exampleInput({ input: 'xyx[xyx]xyx', part2: 0 });
    this.exampleInput({ input: 'aaa[kek]eke', part2: 1 });
    this.exampleInput({ input: 'zazbz[bzb]cdb', part2: 1 });
  }

  get parser() {
    return Parsers.ONE_STRING_PER_LINE;
  }

  supportsTLS(input) {
    const { result } = input.split('').reduce(({ result, brackets }, character, index) => {
      if (result === false) return { result, brackets };
      if (character === '[') return { brackets: true, result };
      if (character === ']') return { brackets: false, result };
      if (input[index + 1] !== character && input[index + 2] === input[index + 1] && input[index + 3] === character) return { brackets, result: !brackets };
      return { brackets, result };
    }, { brackets: false, result: undefined });

    return result;
  }

  supportsSSL(input) {
    const { supernet, hypernet } = input.split('').reduce(({ brackets, supernet, hypernet }, character, index) => {
      if (character === '[') return { brackets: true, supernet, hypernet };
      if (character === ']') return { brackets: false, supernet, hypernet };
      if (input[index + 1] !== character && input[index + 2] === character && !['[', ']'].includes(input[index + 1])) {
        if (brackets) {
          return { brackets, supernet, hypernet: [...hypernet, input.substr(index, 3)] };
        }
        return { brackets, supernet: [...supernet, input.substr(index, 3)], hypernet };
      }
      return { brackets, supernet, hypernet };
    }, { brackets: false, supernet: [], hypernet: [] });

    return supernet.some((s) => hypernet.includes(`${s[1]}${s[0]}${s[1]}`));
  }

  part1(input) {
    return input.filter(this.supportsTLS).length;
  }

  part2(input) {
    return input.filter(this.supportsSSL).length;
  }
}
