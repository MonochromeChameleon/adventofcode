import { QuestionBase } from '../../utils/question-base.js';

class Cube {
  constructor(on, x1, x2, y1, y2, z1, z2) {
    this.on = on;
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.z1 = z1;
    this.z2 = z2;
  }

  maxExtent(extent) {
    if (
      [this.x1, this.y1, this.z1].some((it) => it > extent) ||
      [this.x2, this.y2, this.z2].some((it) => it < -extent)
    ) {
      return undefined;
    }
    return new Cube(
      this.on,
      Math.max(Math.min(this.x1, extent), -extent),
      Math.max(Math.min(this.x2, extent), -extent),
      Math.max(Math.min(this.y1, extent), -extent),
      Math.max(Math.min(this.y2, extent), -extent),
      Math.max(Math.min(this.z1, extent), -extent),
      Math.max(Math.min(this.z2, extent), -extent)
    );
  }

  intersect(other) {
    return (
      this.x1 <= other.x2 &&
      this.x2 >= other.x1 &&
      this.y1 <= other.y2 &&
      this.y2 >= other.y1 &&
      this.z1 <= other.z2 &&
      this.z2 >= other.z1
    );
  }

  add(other) {
    if (!this.intersect(other)) {
      return [this];
    } else {
      const getCoords = (axis) => {
        return [
          {
            from: this[`${axis}1`],
            to: Math.max(this[`${axis}1`], other[`${axis}1`]) - 1,
            middle: false,
          },
          {
            from: Math.max(this[`${axis}1`], other[`${axis}1`]),
            to: Math.min(this[`${axis}2`], other[`${axis}2`]),
            middle: true,
          },
          {
            from: Math.min(this[`${axis}2`], other[`${axis}2`]) + 1,
            to: this[`${axis}2`],
            middle: false,
          },
        ].filter(({ from, to }) => from <= to);
      };

      const xs = getCoords('x');
      const ys = getCoords('y');
      const zs = getCoords('z');

      return xs.flatMap(({ from: x1, to: x2, middle: mx }) =>
        ys.flatMap(({ from: y1, to: y2, middle: my }) =>
          zs.flatMap(({ from: z1, to: z2, middle: mz }) => {
            return mz && my && mx ? [] : [new Cube(true, x1, x2, y1, y2, z1, z2)];
          })
        )
      );
    }
  }

  get size() {
    return (1 + this.x2 - this.x1) * (1 + this.y2 - this.y1) * (1 + this.z2 - this.z1);
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2021, 22, 615700, 1236463892941356);

    this.testInput('./testinputs/22.txt', 474140, 2758514936282235);
  }

  parseLine(line) {
    const [, onoff, ...rest] = /^(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)$/.exec(line);
    const [x1, x2, y1, y2, z1, z2] = rest.map(Number);
    return new Cube(onoff === 'on', x1, x2, y1, y2, z1, z2);
  }

  parseInput(lines) {
    return lines.map(this.parseLine);
  }

  part1(input) {
    const [first, ...rest] = input.map((c) => c.maxExtent(50)).filter((it) => it);
    return rest
      .reduce(
        (cubes, next) => {
          const newCubes = cubes.flatMap((c) => c.add(next));
          return next.on ? [...newCubes, next] : newCubes;
        },
        [first]
      )
      .reduce((sum, cube) => sum + cube.size, 0);
  }

  part2([first, ...rest]) {
    return rest
      .reduce(
        (cubes, next) => {
          const newCubes = cubes.flatMap((c) => c.add(next));
          return next.on ? [...newCubes, next] : newCubes;
        },
        [first]
      )
      .reduce((sum, cube) => sum + cube.size, 0);
  }
}
