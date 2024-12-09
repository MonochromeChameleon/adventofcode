import { Parsers, QuestionBase } from '../../utils/question-base.js';
import { groupBy } from '../../utils/count-by-value.js';
import { Vector } from '../../utils/vector.js';
import { hcf } from '../../utils/number-utils.js';

export class Question extends QuestionBase {
  constructor() {
    super(2024, 8, 214, 809);

    this.exampleInput({ part1: 14, part2: 34 });
  }

  get parser() {
    return Parsers.GRID;
  }

  getPairs(a, ...aaa) {
    if (!aaa.length) return [];
    return [
      ...aaa.map((aa) => [a, aa]),
      ...this.getPairs(...aaa)
    ];
  }

  postParse({ grid, width, height }) {
    const antennae = grid.map((g, ix) => ({ value: g, location: new Vector(ix % width, Math.floor(ix / width)) })).filter(({ value }) => value !== '.');
    const grouped = groupBy(antennae, ({ value }) => value);
    const pairs = Object.values(grouped).flatMap((group) => this.getPairs(...group));
    return { pairs, width, height };
  }

  part1({ pairs, width, height }) {
    const antinodes = pairs.flatMap(([{ location: a}, { location: b }]) => [b.add(b.subtract(a)), a.add(a.subtract(b))]);
    const validAntinodes = antinodes.filter(({ x, y }) => x >=0 && y >= 0 && x < width && y < height).reduce((aaa, b) => aaa.every((a) => !a.equals(b)) ? [...aaa, b] : aaa, []);
    return validAntinodes.length;
  }

  findResonantAntinodes(a, b, width, height) {
    const step = b.subtract(a);
    const stepLcm = hcf(Math.abs(step.x), Math.abs(step.y));
    const microstep = new Vector(step.x / stepLcm, step.y / stepLcm);
    let start = a;
    while (start.x >=0 && start.x < width && start.y >= 0 && start.y < height) start = start.subtract(microstep);
    const out = [];
    start = start.add(microstep);
    while (start.x >=0 && start.x < width && start.y >= 0 && start.y < height) {
      out.push(start);
      start = start.add(microstep);
    }

    return out;
  }

  part2({ pairs, width, height }) {
    return pairs.flatMap(([{ location: a }, { location: b }]) => this.findResonantAntinodes(a, b, width, height))
      .reduce((aaa, b) => aaa.every((a) => !a.equals(b)) ? [...aaa, b] : aaa, [])
      .length;
  }
}

// 00992111777.44.333....5555.6666.....
