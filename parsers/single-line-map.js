import { Parser } from './parser.js';

export class SingleLineParser extends Parser {
  parseInput(lines) {
    return this.parseLine.call(this, lines[0]); // eslint-disable-line no-useless-call
  }
}
