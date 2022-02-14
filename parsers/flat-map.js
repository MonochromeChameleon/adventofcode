import { Parser } from './parser.js';

export class FlatMapParser extends Parser {
  parseLine(line) {
    return line
      .split(this.split)
      .filter((it) => it)
      .map(this.parseValue.bind(this));
  }

  parseInput(lines) {
    return lines.flatMap(this.parseLine.bind(this));
  }
}
