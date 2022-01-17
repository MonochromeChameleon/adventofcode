import { Parser } from './parser.js';

export class MultiLineDelimitedNumbersParser extends Parser {
  parseLine(line) {
    return line.split(this.split).map(Number);
  }
}
