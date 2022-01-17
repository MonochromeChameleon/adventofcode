import { Parser } from './parser.js';

export class SingleLineConstructorParser extends Parser {
  parseInput(lines) {
    const Clz = this.inputConstructor;
    return new Clz(lines[0]);
  }
}
