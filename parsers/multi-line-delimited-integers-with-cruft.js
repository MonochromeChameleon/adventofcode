import { Parser } from './parser.js';

export class MultiLineDelimitedIntegersWithCruftParser extends Parser {
  parseLine(line) {
    return line
      .split(this.m.split)
      .filter((it) => it)
      .map((it) => it.replace(/[^0-9-]/g, ''))
      .map(Number);
  }
}
