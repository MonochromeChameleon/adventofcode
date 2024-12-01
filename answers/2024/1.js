import { Parsers, QuestionBase } from '../../utils/question-base.js';
import { countByValue } from '../../utils/count-by-value.js';

export class Question extends QuestionBase {
  constructor() {
    super(2024, 1, 2285373, 21142653);

    this.exampleInput({ part1: 11, part2: 31 });
  }

  get parser() {
    return Parsers.MULTI_LINE_DELIMITED_NUMBERS;
  }

  get split() {
    return /\s+/;
  }

  postParse(lines) {
    return [
      lines.map(([l]) => l),
      lines.map(([, l]) => l)
    ];
  }

  part1([a, b]) {
    const asort = a.sort();
    const bsort = b.sort();

    return asort.map((aa, ix) => Math.abs(aa - bsort[ix])).reduce((t, v) => t + v, 0);
  }

  part2([a, b]) {
    const acounts = countByValue(a);
    const bcounts = countByValue(b);

    return Object.entries(acounts)
      .map(([ak, ac]) => Number(ak) * ac * (bcounts[ak] || 0))
      .reduce((t, v) => t + v, 0);
  }
}
