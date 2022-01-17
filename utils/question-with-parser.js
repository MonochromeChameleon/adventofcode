import { QuestionBase } from './question-base.js';
import * as Parsers from '../parsers/parsers.js';

export class QuestionWithParser extends QuestionBase {
  get parser() {
    return Parsers.ONE_NUMBER_PER_LINE;
  }

  parseLine(line) {
    return this.parser.parseLine.call(this, line);
  }

  parseInput(lines) {
    return this.parser.parseInput.call(this, lines);
  }
}
