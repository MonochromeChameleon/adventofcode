import { Parser } from './parser.js';

export class SingleLineMapParser extends Parser {
  parseInput(lines) {
    return this.map.call(this, lines[0]); // eslint-disable-line no-useless-call
  }
}
