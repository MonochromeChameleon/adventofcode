import { Parser } from './parser.js';

export class DaisyChainParser extends Parser {
  parseInput(lines) {
    const result = Object.values(this.parsers).reduce((acc, parser) => {
      this.mixout();
      parser.mixin(this);
      return this.parseInput.call(this, acc); // eslint-disable-line no-useless-call
    }, lines);
    this.parseInput = new DaisyChainParser().parseInput;
    return result;
  }
}
