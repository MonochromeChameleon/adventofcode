import { IntcodeQuestion } from './intcode/intcode-question.js';
import { Vector } from '../../utils/vector.js';

const WIDTH = 42;
const HEIGHT = 23;

class Pixel extends Vector {
  constructor(x, y, type = 0) {
    super(x, y);
    this.type = type;
    this.str = [' ', y === 0 ? '-' : '|', '▒', '=', 'o'][type];
  }
}

class Board {
  constructor() {
    this.pixels = Array.from({ length: WIDTH * HEIGHT }, (_, ix) => new Pixel(ix % WIDTH, ~~(ix / WIDTH)));
    this.score = 0;
  }

  get joystick() {
    return [4, 3]
      .map((t) => this.pixels.find(({ type }) => type === t))
      .map(({ x = 0 } = {}) => x)
      .reduce((a, b) => Math.sign(a - b));
  }

  toString() {
    const board = Array.from({ length: HEIGHT }, (_, ix) =>
      this.pixels
        .slice(ix * WIDTH, (ix + 1) * WIDTH)
        .map((px) => px.str)
        .join('')
    );
    return [this.score, ...board].join('\n');
  }
}

export class Question extends IntcodeQuestion {
  constructor() {
    super(2019, 13, 277, 12856);
  }

  runThree(comp, board) {
    const { output: x } = comp.toOutput(board.joystick);
    const { output: y } = comp.toOutput(board.joystick);
    const { output } = comp.toOutput(board.joystick);

    if (comp.terminated) return;

    if (x === -1 && y === 0) {
      board.score = output;
    } else {
      const px = new Pixel(x, y, output);
      const pix = x + y * WIDTH;
      board.pixels[pix] = px;
    }
  }

  calculate(comp) {
    const board = new Board();

    // return new Promise((resolve) => {
    //   const interval = setInterval(() => {
    //     this.runThree(comp, board);
    //     console.clear(); // eslint-disable-line no-console
    //     console.log(board.toString()); // eslint-disable-line no-console
    //
    //     if (comp.terminated) {
    //       clearInterval(interval);
    //       resolve(board);
    //     }
    //   }, 1);
    // });
    while (!comp.terminated) this.runThree(comp, board);

    return board;
  }

  async part1(input) {
    const board = await this.calculate(input);
    console.log(board.toString()); // eslint-disable-line no-console
    return board.pixels.filter((it) => it.type === 2).length;
  }

  async part2(input) {
    const board = await this.calculate(input.override(0, 2));
    return board.score;
  }
}
