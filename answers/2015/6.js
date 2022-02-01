import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2015, 6, 543903, 14687245);
  }

  parseLine(line) {
    const [, action, ...rest] = /^(turn on|turn off|toggle) (\d+),(\d+) through (\d+),(\d+)$/.exec(line);
    const [x1, y1, x2, y2] = rest.map(Number);

    const getAction = () => {
      switch (action) {
        case 'turn on':
          return () => 1;
        case 'turn off':
          return () => 0;
        case 'toggle':
          return (i) => 1 - i;
      }
    };

    const getDim = () => {
      switch (action) {
        case 'turn on':
          return (i) => i + 1;
        case 'turn off':
          return (i) => Math.max(i - 1, 0);
        case 'toggle':
          return (i) => i + 2;
      }
    };

    return {
      action: getAction(),
      dim: getDim(),
      x1,
      y1,
      x2,
      y2,
    };
  }

  applyFunction(input, func) {
    return input.reduce((state, { [func]: action, x1, y1, x2, y2 }) => {
      for (let x = x1; x <= x2; x += 1) {
        for (let y = y1; y <= y2; y += 1) {
          const ix = x + y * 1000;
          state[ix] = action(state[ix]);
        }
      }
      return state;
    }, new Array(1000000).fill(0));
  }

  part1(input) {
    return this.applyFunction(input, 'action').reduce((sum, i) => sum + i, 0);
  }

  part2(input) {
    return this.applyFunction(input, 'dim').reduce((sum, i) => sum + i, 0);
  }
}
