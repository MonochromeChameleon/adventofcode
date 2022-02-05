import { Parser } from './parser.js';

export class SingleLineSplitMapParser extends Parser {
  parseInput(lines) {
    return lines[0].split(this.split).map((it) => this.parseValue(it.trim()));
  }
}
