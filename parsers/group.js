import { Parser } from './parser.js';

export class GroupParser extends Parser {
  parseInput(lines) {
    const groupSize = this.m.groupSize;
    const groupDelimiter = this.m.groupDelimiter;
    if (groupSize) {
      return Array.from({ length: lines.length / groupSize }, (_, i) =>
        this.parseGroup(lines.slice(i * groupSize, (i + 1) * groupSize))
      );
    }

    if (groupDelimiter) {
      const testDelimiter =
        groupDelimiter instanceof RegExp ? (line) => groupDelimiter.test(line) : (line) => line === groupDelimiter;
      return lines
        .reduce(
          (out, line) => {
            if (testDelimiter(line)) {
              out.unshift([]);
            } else {
              out[0].push(line);
            }

            return out;
          },
          [[]]
        )
        .reverse()
        .filter((group) => group.length)
        .map((group) => this.parseGroup(group));
    }
  }
}
