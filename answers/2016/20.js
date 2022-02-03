import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2016, 20, 22887907, 109);

    this.exampleInput({ filename: '20a', part1: 3, part2: 2 }, 9);
  }

  get parser() {
    return Parsers.MULTI_LINE_DELIMITED_NUMBERS;
  }

  get split() {
    return '-';
  }

  overlaps([a, b], [c, d]) {
    if (a < c - 1 && b < c - 1) return false;
    if (a > d + 1 && b > d + 1) return false;
    return true;
  }

  merge(...ranges) {
    return [ranges.reduce((a, b) => Math.min(a, b)), ranges.reduce((a, b) => Math.max(a, b))];
  }

  squashRanges(ranges) {
    return ranges.reduce((squashed, next) => {
      const distinct = squashed.filter((s) => !this.overlaps(s, next));
      const merged = squashed.filter((s) => this.overlaps(s, next)).flat(Infinity);

      return [...distinct, this.merge(...merged, ...next)];
    }, []);
  }

  part1(ranges) {
    const uniqueRanges = this.squashRanges(ranges).sort(([a], [b]) => a - b);
    if (uniqueRanges[0][0] > 0) return 0;
    return uniqueRanges[0][1] + 1;
  }

  part2(ranges, limit = 4294967295) {
    const uniqueRanges = this.squashRanges(ranges).sort(([a], [b]) => a - b);
    const result = uniqueRanges
      .slice(1)
      .reduce(({ count, previous }, [a, b]) => ({ count: count + (a - previous - 1), previous: b }), {
        count: uniqueRanges[0][0],
        previous: uniqueRanges[0][1],
      });
    return result.count + limit - result.previous;
  }
}
