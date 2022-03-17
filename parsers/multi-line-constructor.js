import { Parser } from './parser.js';

export class MultiLineConstructorParser extends Parser {
  get spreadParams() {
    return false;
  }

  parseLine(line) {
    const Clz = this.m.inputConstructor;
    const spread = this.m.spreadParams;
    return spread ? new Clz(...line) : new Clz(line);
  }
}
