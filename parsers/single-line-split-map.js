import { Parser } from './parser.js';

export class SingleLineSplitMapParser extends Parser {
  parseInput(lines) {
    return lines[0].split(this.m.split).map((it) => this.m.parseValue.call(this, it.trim()));
  }
}
