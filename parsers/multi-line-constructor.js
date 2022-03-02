import { Parser } from './parser.js';

export class MultiLineConstructorParser extends Parser {
  parseLine(line) {
    const Clz = this.m.inputConstructor;
    return new Clz(line);
  }
}
