export class Parser {
  get split() {
    return '';
  }

  parseLine(line) {
    return line;
  }

  parseInput(lines) {
    return lines.map(this.parseLine.bind(this)).filter((it) => it !== undefined);
  }
}
