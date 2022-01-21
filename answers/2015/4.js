import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { find0xHash } from '../../utils/bad-blockchain.js';

export class Question extends QuestionBase {
  constructor() {
    super(2015, 4, 254575, 1038736);

    // Examples are slow
    // this.exampleInput({ input: 'abcdef', part1: 609043 });
    // this.exampleInput({ input: 'pqrstuv', part1: 1048970 });
  }

  get parser() {
    return Parsers.SINGLE_LINE_STRING;
  }

  part1(input) {
    return find0xHash('md5', input, 5);
  }

  part2(input) {
    return find0xHash('md5', input, 6, this.answers.part1);
  }
}
