import { QuestionBase } from '../../utils/question-base.js';
import { countByValue } from '../../utils/count-by-value.js';

export class Question extends QuestionBase {
  constructor() {
    super(2021, 6, 380612, 1710166656900);

    this.testInput('./testinputs/6.txt', 5934, 26984457539);
  }

  parseLine(line) {
    return line.split(',').map(Number);
  }

  parseInput(lines) {
    return lines.flatMap(this.parseLine);
  }

  countFish(input, days) {
    const startingCount = countByValue(input);
    const endCount = Array.from({ length: days }).reduce(
      ({
        0: zero = 0,
        1: one = 0,
        2: two = 0,
        3: three = 0,
        4: four = 0,
        5: five = 0,
        6: six = 0,
        7: seven = 0,
        8: eight = 0,
      }) => {
        return {
          0: one,
          1: two,
          2: three,
          3: four,
          4: five,
          5: six,
          6: seven + zero,
          7: eight,
          8: zero,
        };
      },
      startingCount
    );

    return Object.values(endCount).reduce((sofar, count) => sofar + count, 0);
  }

  part1(input) {
    return this.countFish(input, 80);
  }

  part2(input) {
    return this.countFish(input, 256);
  }
}
