import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { Vector } from '../../utils/vector.js';

class Nanobot extends Vector {
  constructor(x, y, z, r) {
    super(x, y, z);
    this.r = r;
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2018, 23, 294, 88894457);

    this.exampleInput({ part1: 7 });
    this.exampleInput({ part2: 36 });
  }

  get parser() {
    return Parsers.MULTI_LINE_DELIMITED_INTEGERS_WITH_CRUFT;
  }

  get split() {
    return ',';
  }

  postParse(lines) {
    return lines.map((values) => new Nanobot(...values));
  }

  part1(bots) {
    const maxRangeBot = bots.reduce((max, bot) => (max.r > bot.r ? max : bot));
    const manhattans = bots.map((bot) => bot.subtract(maxRangeBot)).map(({ manhattan }) => manhattan);
    return manhattans.filter((manhattan) => manhattan <= maxRangeBot.r).length;
  }

  part2(bots) {
    return bots
      .flatMap(({ manhattan, r }) => [
        { range: Math.max(manhattan - r, 0), delta: 1 },
        { range: manhattan + r + 1, delta: -1 },
      ])
      .sort((a, b) => a.range - b.range)
      .reduce(
        ({ count, max, bestRange }, { range, delta }) => ({
          count: count + delta,
          max: Math.max(max, count + delta),
          bestRange: count + delta > max ? range : bestRange,
        }),
        { count: 0, max: 0, bestRange: 0 },
      ).bestRange;
  }
}
