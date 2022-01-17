import { Parser } from './parser.js';

export class MultiLineConstructorParser extends Parser {
  parseLine(line) {
    const Clz = this.inputConstructor;
    return new Clz(line);
  }
}
