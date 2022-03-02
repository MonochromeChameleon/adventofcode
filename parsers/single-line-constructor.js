import { Parser } from './parser.js';

export class SingleLineConstructorParser extends Parser {
  parseInput(lines) {
    const Clz = this.m.inputConstructor;
    return new Clz(lines[0]);
  }
}
