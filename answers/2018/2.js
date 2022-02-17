import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { countByValue } from '../../utils/count-by-value.js';

export class Question extends QuestionBase {
  constructor() {
    super(2018, 2, 7657, 'ivjhcadokeltwgsfsmqwrbnuy');

    this.exampleInput({ part1: 12 });
    this.exampleInput({ part2: 'fgij' });
  }

  get parser() {
    return Parsers.MULTI_LINE_SPLIT;
  }

  part1(input) {
    const countedByValue = input.map((it) => countByValue(it));
    const twos = countedByValue.filter((it) => Object.values(it).some((v) => v === 2)).length;
    const threes = countedByValue.filter((it) => Object.values(it).some((v) => v === 3)).length;
    return twos * threes;
  }

  part2(input) {
    return input.reduce((out, it, ix) => {
      if (out) return out;
      const other = input.slice(ix + 1);
      const diff = other.find((o) => o.filter((v, ii) => v !== it[ii]).length === 1);
      return diff && diff.filter((v, ii) => v === it[ii]).join('');
    }, false);
  }
}
