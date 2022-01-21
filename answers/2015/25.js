import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { triangle } from '../../utils/triangle-utils.js';

export class Question extends QuestionBase {
  constructor() {
    super(2015, 25, 2650453);

    this.exampleInput({ input: '1,1', part1: 20151125 });
    this.exampleInput({ input: '2,1', part1: 31916031 });
    this.exampleInput({ input: '1,2', part1: 18749137 });
    this.exampleInput({ input: '3,1', part1: 16080970 });
    this.exampleInput({ input: '2,2', part1: 21629792 });
    this.exampleInput({ input: '1,3', part1: 17289845 });
    this.exampleInput({ input: '4,1', part1: 24592653 });
    this.exampleInput({ input: '3,2', part1: 8057251 });
    this.exampleInput({ input: '2,3', part1: 16929656 });
    this.exampleInput({ input: '1,4', part1: 30943339 });
    this.exampleInput({ input: '5,1', part1: 77061 });
    this.exampleInput({ input: '4,2', part1: 32451966 });
    this.exampleInput({ input: '3,3', part1: 1601130 });
    this.exampleInput({ input: '2,4', part1: 7726640 });
    this.exampleInput({ input: '1,5', part1: 10071777 });
    this.exampleInput({ input: '6,1', part1: 33071741 });
    this.exampleInput({ input: '5,2', part1: 17552253 });
    this.exampleInput({ input: '4,3', part1: 21345942 });
    this.exampleInput({ input: '3,4', part1: 7981243 });
    this.exampleInput({ input: '2,5', part1: 15514188 });
    this.exampleInput({ input: '1,6', part1: 33511524 });
    this.exampleInput({ input: '6,2', part1: 6796745 });
    this.exampleInput({ input: '5,3', part1: 28094349 });
    this.exampleInput({ input: '4,4', part1: 9380097 });
    this.exampleInput({ input: '3,5', part1: 11661866 });
    this.exampleInput({ input: '2,6', part1: 4041754 });
    this.exampleInput({ input: '6,3', part1: 25397450 });
    this.exampleInput({ input: '5,4', part1: 6899651 });
    this.exampleInput({ input: '4,5', part1: 10600672 });
    this.exampleInput({ input: '3,6', part1: 16474243 });
    this.exampleInput({ input: '6,4', part1: 24659492 });
    this.exampleInput({ input: '5,5', part1: 9250759 });
    this.exampleInput({ input: '4,6', part1: 31527494 });
    this.exampleInput({ input: '6,5', part1: 1534922 });
    this.exampleInput({ input: '5,6', part1: 31663883 });
    this.exampleInput({ input: '6,6', part1: 27995004 });

    this.exampleInput({ input: '5,1', part1: 2 }, 2, 7, 11);
  }

  get parser() {
    return Parsers.SINGLE_LINE_MAP;
  }

  map(value) {
    return value
      .replace(/[^\d,]/g, '')
      .split(',')
      .filter((it) => it)
      .map(Number);
  }

  get split() {
    return ',';
  }

  getValue(index, start, multiplier, remainder) {
    let its = index;
    let value = start;
    while (its > 0) {
      value = (value * multiplier) % remainder;
      its -= 1;
    }
    return value;
  }

  part1([row, col], start = 20151125, multiplier = 252533, remainder = 33554393) {
    const t = col + row - 1;
    const index = triangle(t) - row;
    return this.getValue(index, start, multiplier, remainder);
  }
}
