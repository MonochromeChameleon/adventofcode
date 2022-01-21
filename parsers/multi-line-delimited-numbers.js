import { Parser } from './parser.js';

export class MultiLineDelimitedNumbersParser extends Parser {
  get split() {
    return ',';
  }

  parseLine(line) {
    return line
      .split(this.split)
      .filter((it) => it)
      .map(Number);
  }
}
