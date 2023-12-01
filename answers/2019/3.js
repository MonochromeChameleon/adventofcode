import { QuestionBase } from '../../utils/question-base.js';
import { Vector } from '../../utils/vector.js';

const hMult = (dir) => {
  switch (dir) {
    case 'L':
      return -1;
    case 'R':
      return 1;
    default:
      return 0;
  }
};

const vMult = (dir) => {
  switch (dir) {
    case 'U':
      return -1;
    case 'D':
      return 1;
    default:
      return 0;
  }
};

class Intersection extends Vector {
  constructor(first, second) {
    const [
      {
        start: { x },
      },
      {
        start: { y },
      },
    ] = [first, second].sort((a, b) => a.x - b.x);
    super(x, y);
    this.distance =
      first.sofarDistance +
      second.sofarDistance +
      first.start.subtract(this).manhattan +
      second.start.subtract(this).manhattan;
  }
}

class Wire extends Vector {
  constructor(def, origin, sofarDistance) {
    const [, dir, dist] = /(\w)(\d+)/.exec(def);
    const distance = Number(dist);
    super(hMult(dir) * distance, vMult(dir) * distance);
    this.sofarDistance = sofarDistance;
    this.start = origin;
    this.end = origin.add(this);
    this.horizontal = this.y === 0;
  }

  min(dim) {
    return Math.min(this.start[dim], this.end[dim]);
  }

  max(dim) {
    return Math.max(this.start[dim], this.end[dim]);
  }

  intersects(other, swap = true) {
    if (
      this.horizontal &&
      !other.horizontal &&
      this.min('x') < other.min('x') &&
      this.max('x') > other.min('x') &&
      other.min('y') < this.min('y') &&
      other.max('y') > this.min('y')
    ) {
      return true;
    }
    return swap ? other.intersects(this, false) : false;
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2019, 3, 316, 16368);

    this.exampleInput({
      input: ['R75,D30,R83,U83,L12,D49,R71,U7,L72', 'U62,R66,U55,R34,D71,R55,D58,R83'],
      part1: 159,
      part2: 610,
    });
    this.exampleInput({
      input: ['R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51', 'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7'],
      part1: 135,
      part2: 410,
    });
  }

  parseLine(line) {
    const start = new Vector(0, 0);
    const [first, ...rest] = line.split(/,/);

    return rest.reduce(
      (wires, direction) => {
        const prev = wires.pop();
        const wire = new Wire(direction, prev.end, prev.sofarDistance + prev.manhattan);
        return [...wires, prev, wire];
      },
      [new Wire(first, start, 0)],
    );
  }

  calculate(getter, first, second) {
    return first
      .flatMap((a) => second.map((b) => ({ a, b })))
      .filter(({ a, b }) => a.intersects(b))
      .map(({ a, b }) => new Intersection(a, b))
      .sort((a, b) => getter(a) - getter(b))
      .map(getter)
      .find(Boolean);
  }

  part1(input) {
    return this.calculate((it) => it.manhattan, ...input);
  }

  part2(input) {
    return this.calculate((it) => it.distance, ...input);
  }
}
