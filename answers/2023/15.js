import { Parsers, QuestionBase } from '../../utils/question-base.js';
import { groupBy } from '../../utils/count-by-value.js';

export class Question extends QuestionBase {
  constructor() {
    super(2023, 15, 515210, 246762);

    this.exampleInput({ part1: 1320, part2: 145 });
  }

  get parser() {
    return Parsers.SINGLE_LINE_SPLIT;
  }

  get split() {
    return ',';
  }

  hash(str) {
    return str.split('').reduce((hsh, char) => (17 * (hsh + char.charCodeAt())) % 256, 0);
  }

  buildBoxState(changes) {
    return changes.reduce((state, { label, action, ...rest }, ix) => {
      const { [label]: l, ...s } = state;
      return action === '=' ? { ...s, [label]: { order: ix, ...l, ...rest } } : s;
    }, {});
  }

  calculateBoxPower(contents) {
    return Object.values(contents)
      .sort(({ order: a }, { order: b }) => a - b)
      .map(({ focal, boxNo }, ix) => (boxNo + 1) * (ix + 1) * focal)
      .reduce((a, b) => a + b, 0);
  }

  part1(input) {
    return input.map(this.hash).reduce((a, b) => a + b);
  }

  part2(input) {
    const lenses = input.map((inp) => {
      const [label, focal] = inp.split(/\W/);
      const action = inp[label.length];
      const boxNo = this.hash(label);

      return { label, focal: Number(focal), action, boxNo };
    });

    const boxes = groupBy(lenses, ({ boxNo }) => boxNo);

    return Object.values(boxes)
      .map(this.buildBoxState)
      .map(this.calculateBoxPower)
      .reduce((a, b) => a + b);
  }
}
