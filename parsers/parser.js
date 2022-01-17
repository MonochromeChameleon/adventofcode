export class Parser {
  parseLine(line) {
    return line;
  }

  parseInput(lines) {
    return lines.map(this.parseLine.bind(this));
  }
}
