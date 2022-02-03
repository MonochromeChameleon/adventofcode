import { Parser } from './parser.js';

export class MultiLineMapParser extends Parser {
  parseInput(lines) {
    return lines.map(this.map.bind(this)).filter((it) => it !== undefined);
  }
}
