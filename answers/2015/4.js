import { QuestionWithParser } from '../../utils/question-with-parser.js';
import * as Parsers from '../../parsers/parsers.js';
import { createHash } from 'crypto';

export class Question extends QuestionWithParser {
  constructor() {
    super(2015, 4, 254575, 1038736);

    // Examples are slow
    // this.exampleInput({ input: 'abcdef', part1: 609043 });
    // this.exampleInput({ input: 'pqrstuv', part1: 1048970 });
  }

  get parser() {
    return Parsers.SINGLE_LINE_STRING;
  }

  part1 (input) {
    let i = 0;
    let hash = 'x';
    while (hash.substr(0, 5) !== '00000') {
      i++;
      hash = createHash('md5').update(input + i).digest('hex');
    }

    return i;
  }

  part2 (input) {
    let i = this.answers.part1;
    let hash = 'x';
    while (hash.substr(0, 6) !== '000000') {
      i++;
      hash = createHash('md5').update(input + i).digest('hex');
    }

    return i;
  }
}
