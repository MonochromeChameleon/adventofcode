import { Parser } from './parser.js';

export class MultiLineDelimitedNumbersParser extends Parser {
  parseLine(line) {
    return line
      .split(this.m.split)
      .filter((it) => it)
      .map(Number);
  }
}
