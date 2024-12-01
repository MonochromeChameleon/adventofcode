import { Parser } from './parser.js';

export class DaisyChainParser extends Parser {
  parseInput(lines) {
    const result = Object.values(this.m.parsers).reduce((acc, parser) => {
      this.mixout();
      parser.mixin(this);
      return this.m.parseInput.call(this, acc);  
    }, lines);
    this.parseInput = new DaisyChainParser().parseInput;
    return result;
  }
}
