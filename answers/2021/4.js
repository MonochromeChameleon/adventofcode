import { QuestionBase } from '../../utils/question-base.js';
import { Board } from './bingo/board.js';

export class Question extends QuestionBase {
  constructor() {
    super(2021, 4, 58838, 6256);

    this.testInput('./testinputs/4.txt', 4512, 1924);
  }

  parseInput(lines) {
    const [first, ...boards] = lines;

    const calls = first.split(',').map(Number);
    const callLookup = calls.reduce((out, call, ix) => {
      out[call] = ix;
      return out;
    }, []);

    const input = boards.reduce((out, row, ix) => {
      if (ix % 5 === 0) {
        out.unshift(new Board(calls, callLookup));
      }
      out[0].addLine(row);
      return out;
    }, []);

    input.forEach((b) => b.complete());
    return input;
  }

  part1(input) {
    const firstCompleted = input.reduce((best, b) => (best.completedAt < b.completedAt ? best : b), {
      completedAt: Infinity,
    });
    return firstCompleted.calculate();
  }

  part2(input) {
    const lastCompleted = input.reduce((worst, b) => (worst.completedAt > b.completedAt ? worst : b), {
      completedAt: -1,
    });
    return lastCompleted.calculate();
  }
}
