import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { multiPredicate } from '../../utils/compose.js';

const isAscending = (nums) => nums.every((v, ix, arr) => !ix || v >= arr[ix - 1]);
const hasDouble = (nums) => nums.some((v, ix, arr) => v === arr[ix - 1]);
const hasStrictDouble = (nums) =>
  nums.some((v, ix, arr) => v === arr[ix - 1] && v !== arr[ix - 2] && v !== arr[ix + 1]);

export class Question extends QuestionBase {
  constructor() {
    super(2019, 4, 966, 628);
  }

  get parser() {
    return Parsers.SINGLE_LINE_DELIMITED_NUMBERS;
  }

  get split() {
    return '-';
  }

  part1([from, to]) {
    const test = multiPredicate(hasDouble, isAscending);
    return Array.from({ length: to + 1 - from }, (_, ix) =>
      String(ix + from)
        .split('')
        .map(Number),
    ).filter(test).length;
  }

  part2([from, to]) {
    const test = multiPredicate(hasDouble, isAscending, hasStrictDouble);
    return Array.from({ length: to + 1 - from }, (_, ix) =>
      String(ix + from)
        .split('')
        .map(Number),
    ).filter(test).length;
  }
}
