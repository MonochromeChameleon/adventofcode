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

class Race {
  constructor() {
    this.reindeer = [];
    this.scoreboard = {};
  }

  addLine(line) {
    const reindeer = new Reindeer(line);
    this.reindeer.push(reindeer);
    this.scoreboard[reindeer.name] = 0;
    return this;
  }

  maxDistanceAfter(seconds) {
    return this.reindeer.map((r) => r.distanceAfter(seconds)).reduce((a, b) => Math.max(a, b));
  }

  winnerAfter(seconds) {
    const maxDistance = this.maxDistanceAfter(seconds);
    return this.reindeer.filter((it) => it.distanceAfter(seconds) === maxDistance);
  }

  updateScoreboard(seconds) {
    const winners = this.winnerAfter(seconds);
    winners.forEach((it) => this.scoreboard[it.name]++);
    return this;
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2015, 14, 2640, 1102);
  }

  get parser() {
    return Parsers.REDUCE;
  }

  get reducer() {
    return Race;
  }

  part1(race) {
    return race.maxDistanceAfter(2503);
  }

  part2(race) {
    Array.from({ length: 2503 }).forEach((_, i) => race.updateScoreboard(i + 1));
    return Object.values(race.scoreboard).reduce((a, b) => Math.max(a, b));
  }
}
