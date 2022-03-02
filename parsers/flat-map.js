import { Parser } from './parser.js';

export class FlatMapParser extends Parser {
  parseLine(line) {
    return line
      .split(this.m.split)
      .filter((it) => it)
      .map(this.m.parseValue.bind(this));
  }

  parseInput(lines) {
    return lines.flatMap(this.m.parseLine.bind(this));
  }
}
