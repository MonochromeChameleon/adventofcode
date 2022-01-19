import { Parser } from './parser.js';

export class ReduceParser extends Parser {
  parseInput(lines) {
    const Reducer = this.reducer;
    return lines.reduce((r, l) => {
      r.addLine(l);
      return r;
    }, new Reducer());
  }
}
