import { QuestionBase } from '../utils/question-base.js';

export class Question extends QuestionBase {
  constructor (args) {
    super(6, 5934, 26984457539, 380612, 1710166656900, args);
  }

  parseLine(line) {
    return line.split(',').map(Number);
  }

  parseInput(lines) {
    return lines.flatMap(this.parseLine);
  }

  initializeFish(days) {
    const reproRate = 7;
    const initialRate = 9;

    const countNewFish = (startDay, fishCounts) => {
      const fishDays = Array.from({ length: ~~(days / reproRate) + 1 }).map((_, ix) => startDay + initialRate + (ix * reproRate)).filter(it => it <= days);
      return 1 + fishDays.reduce((acc, day) => acc + fishCounts[day], 0);
    }

    return Array.from({ length: days + initialRate }).reduce((sofar, _, ix) => {
      const offsetDays = days - ix;
      sofar[offsetDays] = countNewFish(offsetDays, sofar);
      return sofar;
    }, {});
  }

  part1 (input) {
    const fishies = this.initializeFish(80);
    return input.map(f => fishies[f - 8]).reduce((sofar, f) => sofar + f, 0);
  }

  part2 (input) {
    const fishies = this.initializeFish(256);
    return input.map(f => fishies[f - 8]).reduce((sofar, f) => sofar + f, 0);
  }
}
