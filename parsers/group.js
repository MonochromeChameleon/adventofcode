import { Parser } from './parser.js';

export class GroupParser extends Parser {
  parseGroup(lines) {
    return lines;
  }

  parseInput(lines) {
    const groupSize = this.m.groupSize;
    const groupDelimiter = this.m.groupDelimiter;
    if (groupSize) {
      return Array.from({ length: lines.length / groupSize }, (_, i) =>
        this.parseGroup(lines.slice(i * groupSize, (i + 1) * groupSize)),
      );
    }

    if (groupDelimiter) {
      return lines
        .reduce(
          (out, line) => {
            if (groupDelimiter.test(line)) {
              if (this.m.retainDelimiter) out.unshift([line]);
              else out.unshift([]);
            } else {
              out[0].push(line);
            }

            return out;
          },
          [[]],
        )
        .reverse()
        .filter((group) => group.length)
        .map((group) => this.parseGroup(group));
    }
  }
}
