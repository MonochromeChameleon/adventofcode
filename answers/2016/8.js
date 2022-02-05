import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2016, 8, 106, 3375032044483544);
  }

  parseLine(line) {
    if (line.startsWith('rect')) {
      const [width, height] = line.replace('rect ', '').split('x').map(Number);
      return { action: 'rect', width, height };
    }
    const [, axis, location, amount] = line.match(/^rotate (row|column) \w=(\d+) by (\d+)$/);
    return { action: 'rotate', axis, location: Number(location), amount: Number(amount) };
  }

  rect(screen, { width, height }) {
    return screen.map((row, y) => row.map((cell, x) => (x < width && y < height ? '#' : cell)));
  }

  rotate(screen, { axis, location, amount }) {
    return screen.map((row, y) =>
      row.map((cell, x) => {
        const tgtx = axis === 'row' && y === location ? (x + 50 - amount) % 50 : x;
        const tgty = axis === 'column' && x === location ? (y + 6 - amount) % 6 : y;
        return screen[tgty][tgtx];
      })
    );
  }

  part1(input) {
    const blankScreen = Array.from({ length: 6 }, () => Array(50).fill(' '));
    const screen = input.reduce((s, { action, ...params }) => this[action](s, params), blankScreen);
    console.log(screen.map((row) => row.join('')).join('\n')); // eslint-disable-line no-console
    return screen.flat(Infinity).filter((it) => it === '#').length;
  }

  part2(input) {
    const blankScreen = Array.from({ length: 6 }, () => Array(50).fill(' '));
    const screen = input.reduce((s, { action, ...params }) => this[action](s, params), blankScreen);
    // Make it binary and then add the rows together so we have a sanity check for the tests.
    return screen.map((row) => parseInt(row.map((cell) => (cell === '#' ? 1 : 0)).join(''), 2)).reduce((a, b) => a + b);
  }
}
