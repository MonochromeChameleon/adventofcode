import { IntcodeQuestion } from './intcode/intcode-question.js';
import { Vector } from '../../utils/vector.js';

const NORTH = 1;
const SOUTH = 2;
const EAST = 3;
const WEST = 4;

const directions = [NORTH, EAST, SOUTH, WEST]; // BAH

class Square extends Vector {
  constructor(x, y, type, stepCount) {
    super(x, y);
    this.type = type;
    this.stepCount = stepCount;
  }
}

class Droid extends Vector {
  constructor(intcode) {
    super(0, 0);
    this.comp = intcode;
    this.squares = [new Square(0, 0, 1)];
    this.stepCount = 0;
  }

  addSquare(x, y, type, stepCount) {
    const square = new Square(x, y, type, stepCount);
    this.squares.push(square);
    return square;
  }

  move(direction) {
    this.comp.runToNextOutput(direction);
    if (this.comp.output === 0) return 0;

    const tgtX = direction < 3 ? this.x : this.x + (direction % 2 ? 1 : -1);
    const tgtY = direction > 2 ? this.y : this.y + (direction % 2 ? -1 : 1);

    const square =
      this.squares.find((s) => s.x === tgtX && s.y === tgtY) ||
      this.addSquare(tgtX, tgtY, this.comp.output, this.stepCount + 1);
    Object.assign(this, square);
    return this.comp.output;
  }
}

export class Question extends IntcodeQuestion {
  constructor() {
    super(2019, 15, 298, 346);
  }

  explore(droid, rightFirst = false) {
    let dirIndex = 0;
    const turn = rightFirst ? 1 : 3;

    let output = 0;
    while (output !== 2) {
      dirIndex = (dirIndex + turn) % 4;
      output = droid.move(directions[dirIndex]);
      while (!output) {
        dirIndex = (dirIndex + turn * 3) % 4;
        output = droid.move(directions[dirIndex]);
      }
    }
  }

  part1(input) {
    const droid = new Droid(input);
    this.explore(droid);
    return droid.squares.find((it) => it.type === 2).stepCount;
  }

  part2(input) {
    const droid = new Droid(input);
    this.explore(droid, true);
    const squares = droid.squares;
    let mins = 0;
    while (squares.some((it) => it.type === 1)) {
      mins += 1;
      const o2 = squares.filter((it) => it.type === 2);
      o2.forEach((it) => {
        it.type = 3;
      });
      o2.flatMap(({ x, y }) =>
        squares.filter(
          (it) => it.type === 1 && Math.abs(it.x - x) <= 1 && Math.abs(it.y - y) <= 1 && (it.x === x || it.y === y)
        )
      ).forEach((n) => {
        n.type = 2;
      });
    }
    return mins;
  }
}
