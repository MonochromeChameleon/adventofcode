import { QuestionBase } from '../../utils/question-base.js';
import { Vector } from '../../utils/vector.js';

export class Question extends QuestionBase {
  constructor() {
    super(2022, 15, 4919281, 12630143363767);

    this.exampleInput({ filename: '15a', part1: 26 }, 10);
    this.exampleInput({ filename: '15a', part2: 56000011 }, 20);
  }

  parseLine(line) {
    const [, sx, sy, bx, by] = /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/
      .exec(line)
      .map(Number);
    const sensor = new Vector(sx, sy);
    const beacon = new Vector(bx, by);
    const delta = beacon.subtract(sensor);

    return { sensor, beacon, manhattan: delta.manhattan };
  }

  scanRow(input, row) {
    return input
      .filter(({ sensor: { y }, manhattan }) => Math.abs(y - row) <= manhattan)
      .map(({ sensor: { x, y }, manhattan }) => {
        const range = manhattan - Math.abs(y - row);
        return { from: x - range, to: x + range };
      })
      .sort(({ from: a }, { from: b }) => a - b)
      .reduce((o, { from, to }) => {
        if (!o.length) return [{ from, to }];
        const { from: ofrom, to: oto } = o.pop();
        if (from <= oto + 1) return [...o, { from: ofrom, to: Math.max(to, oto) }];
        return [...o, { from: ofrom, to: oto }, { from, to }];
      }, []);
  }

  part1(input, tgtY = 2000000) {
    const beacons = new Set(input.filter(({ beacon: { y } }) => y === tgtY).map(({ beacon: { x } }) => x));
    const [{ from, to }] = this.scanRow(input, tgtY);

    return to + 1 - from - beacons.size;
  }

  part2(input, max = 4000000) {
    const rows = Array.from({ length: max }, (_, ix) => ix);
    const y = rows.find((r) => this.scanRow(input, r).length > 1);

    const [{ to }] = this.scanRow(input, y);
    const x = to + 1;
    return x * 4000000 + y;
  }
}
