import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2015, 17, 654, 57);
  }

  get parser() {
    return Parsers.ONE_NUMBER_PER_LINE;
  }

  fillCombinations({ volume, used = [] }, container, ...containers) {
    if (volume === 0) return [{ volume, used }];
    if (containers.length === 0 && volume !== container) return [];
    if (containers.length === 0) {
      return [{ volume, used: [...used, container] }];
    }

    return [
      ...this.fillCombinations({ volume, used }, ...containers),
      ...this.fillCombinations({ volume: volume - container, used: [...used, container] }, ...containers)
    ]
  }

  part1 (containers) {
    return this.fillCombinations({ volume: 150 }, ...containers).length;
  }

  part2 (containers) {
    const combinations = this.fillCombinations({ volume: 150 }, ...containers);
    const numUsed = combinations.map(({ used }) => used.length);
    const minUsed = Math.min(...numUsed);
    return numUsed.filter(num => num === minUsed).length;
  }
}
