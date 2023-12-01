import { QuestionBase } from '../../utils/question-base.js';
import { Vector } from '../../utils/vector.js';
import { minMax } from '../../utils/min-max.js';

export class Question extends QuestionBase {
  constructor() {
    super(2022, 18, 3610, 2082);

    this.exampleInput({ input: ['1,1,1', '2,1,1'], part1: 10 });
    this.exampleInput({ filename: '18a', part1: 64, part2: 58 });
  }

  parseLine(line) {
    return new Vector(...line.split(',').map(Number));
  }

  postParse(lines) {
    return lines.sort((a, b) => a.x - b.x || a.y - b.y || a.z - b.z);
  }

  part1(input) {
    return input.reduce((tot, cube, ix) => {
      const connected = input.slice(0, ix).filter((other) => cube.subtract(other).manhattan === 1);
      return tot + 6 - 2 * connected.length;
    }, 0);
  }

  part2(input) {
    const { min: minX, max: maxX } = minMax(input.map(({ x }) => x));
    const { min: minY, max: maxY } = minMax(input.map(({ y }) => y));
    const { min: minZ, max: maxZ } = minMax(input.map(({ z }) => z));

    const allCubes = Array.from({ length: maxX + 1 - minX }, (_, x) => x + minX).flatMap((x) =>
      Array.from({ length: maxY + 1 - minY }, (_, y) => y + minY).flatMap((y) =>
        Array.from({ length: maxZ + 1 - minZ }, (_, z) => new Vector(x, y, z + minZ)),
      ),
    );

    const lava = new Set(input.map((i) => i.toString()));
    const airCubes = allCubes.filter((c) => !lava.has(c.toString()));

    const regions = airCubes.reduce((rs, cube) => {
      const adjoiningRegions = Object.entries(rs)
        .filter(([, r]) => r.some((c) => c.subtract(cube).manhattan === 1))
        .map(([k]) => k);
      const discreteRegions = Object.keys(rs).filter((k) => !adjoiningRegions.includes(k));

      return Object.fromEntries([
        ...discreteRegions.map((k) => [k, rs[k]]),
        [cube.toString(), this.postParse([cube, ...adjoiningRegions.flatMap((k) => rs[k])])],
      ]);
    }, {});

    const innerRegions = Object.values(regions).filter((r) =>
      r.every(({ x, y, z }) => x !== minX && x !== maxX && y !== minY && y !== maxY && z !== minZ && z !== maxZ),
    );

    const innerTotals = innerRegions.map((region) =>
      region.reduce((tot, cube, ix) => {
        const connected = region.slice(0, ix).filter((other) => cube.subtract(other).manhattan === 1);
        return tot + 6 - 2 * connected.length;
      }, 0),
    );

    const innerTotal = innerTotals.reduce((a, b) => a + b, 0);
    return this.answers.part1 - innerTotal;
  }
}
