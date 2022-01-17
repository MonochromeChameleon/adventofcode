import { QuestionWithParser } from '../../utils/question-with-parser.js';
import * as Parsers from '../../parsers/parsers.js';

export class Question extends QuestionWithParser {
  constructor() {
    super(2015, 11);
  }

  get parser() {
    return Parsers.SINGLE_LINE_STRING;
  }

  part1 (input) {
    return input.length;
  }

  part2 (input) {
    return input.reduce((a, b) => a + b, 0);
  }
}
