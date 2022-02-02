import { QuestionBase, Parsers } from '../../utils/question-base.js';

class Reindeer {
  constructor(line) {
    const [, name, ...rest] =
      /^(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds.$/.exec(line);
    const [speed, flyTime, restTime] = rest.map(Number);
    this.name = name;
    this.speed = speed;
    this.flyTime = flyTime;
    this.cycleTime = flyTime + restTime;

    this.distanceCache = {};
  }

  distanceAfter(seconds) {
    if (!this.distanceCache[seconds]) {
      const fullRepeats = ~~(seconds / this.cycleTime);
      const fullRepeatDistance = fullRepeats * this.flyTime * this.speed;
      const partialRepeatDistance = Math.min(seconds % this.cycleTime, this.flyTime) * this.speed;
      this.distanceCache[seconds] = fullRepeatDistance + partialRepeatDistance;
    }
    return this.distanceCache[seconds];
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2015, 14, 2640, 1102);
  }

  get parser() {
    return Parsers.MULTI_LINE_CONSTRUCTOR;
  }

  get inputConstructor() {
    return Reindeer;
  }

  maxDistanceAfter(reindeer, seconds) {
    return reindeer.map((r) => r.distanceAfter(seconds)).reduce((a, b) => Math.max(a, b));
  }

  winnerAfter(reindeer, seconds) {
    const maxDistance = this.maxDistanceAfter(reindeer, seconds);
    return reindeer.filter((it) => it.distanceAfter(seconds) === maxDistance);
  }

  updateScoreboard(scoreboard, reindeer, seconds) {
    const winners = this.winnerAfter(reindeer, seconds);
    winners.forEach((it) => {
      scoreboard[it.name] += 1;
    });
    return scoreboard;
  }

  part1(reindeer) {
    return this.maxDistanceAfter(reindeer, 2503);
  }

  part2(reindeer) {
    const scoreboard = Array.from({ length: 2503 }).reduce(
      (scores, _, i) => this.updateScoreboard(scores, reindeer, i + 1),
      reindeer.reduce((acc, it) => ({ ...acc, [it.name]: 0 }), {})
    );
    return Object.values(scoreboard).reduce((a, b) => Math.max(a, b));
  }
}
