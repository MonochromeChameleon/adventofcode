import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { Vector } from '../../utils/vector.js';

class AsteroidPair {
  constructor(first, second) {
    this.first = first;
    this.second = second;
  }

  get xOffset() {
    return this.second.x - this.first.x;
  }

  get yOffset() {
    return this.second.y - this.first.y;
  }

  get range() {
    return Math.sqrt(this.xOffset ** 2 + this.yOffset ** 2);
  }

  get angle() {
    if (!this.yOffset) {
      return ((this.xOffset > 0 ? 1 : 3) * Math.PI) / 2;
    }

    if (!this.xOffset) {
      return this.yOffset < 0 ? 0 : Math.PI;
    }

    const tan = this.xOffset / -this.yOffset;
    const angle = Math.atan(tan);

    if (this.yOffset > 0) {
      return angle + Math.PI;
    }

    if (this.xOffset < 0) {
      return angle + 2 * Math.PI;
    }

    return angle;
  }

  canSee(pairs) {
    const angle = this.angle;
    const range = this.range;
    const onAngle = pairs.filter((it) => it !== this && it.angle === angle);
    return onAngle.every((it) => it.range > range);
  }
}

class Asteroid extends Vector {
  applyField(field) {
    return field.filter((it) => it !== this).map((it) => new AsteroidPair(this, it));
  }

  countVisible(field) {
    const pairs = field.filter((it) => it !== this).map((it) => new AsteroidPair(this, it));
    return pairs.filter((pair) => pair.canSee(pairs)).length;
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2019, 10, 267, 1309);

    this.exampleInput({ part1: 8 });
    this.exampleInput({ part1: 33 });
    this.exampleInput({ part1: 35 });
    this.exampleInput({ part1: 41 });
    this.exampleInput({ part1: 210, part2: 802 });
  }

  parseLine(line, y) {
    return line
      .split('')
      .map((val, x) => (val === '#' ? new Asteroid(x, y) : undefined))
      .filter((it) => it);
  }

  get parser() {
    return Parsers.FLAT_MAP;
  }

  part1(input) {
    const visibleCounts = input.map((it) => it.countVisible(input));
    return visibleCounts.slice(0).sort((a, b) => b - a)[0];
  }

  part2(input) {
    const bestAsteroid = input.find((it) => it.countVisible(input) === this.answers.part1);
    const pairs = bestAsteroid.applyField(input);
    const visiblePairs = pairs.filter((it) => it.canSee(pairs));

    const sortedPairs = visiblePairs.sort((a, b) => a.angle - b.angle);
    const twoHundredth = sortedPairs[199].second;
    return twoHundredth.x * 100 + twoHundredth.y;
  }
}
