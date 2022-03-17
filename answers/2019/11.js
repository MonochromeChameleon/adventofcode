import { IntcodeQuestion } from './intcode/intcode-question.js';
import { Vector } from '../../utils/vector.js';
import { getLetter, letterSlice, printLetters } from '../../utils/grid-letters.js';

class PaintedPanel extends Vector {
  constructor(point, colour) {
    super(point.x, point.y);
    this.colour = colour;
  }
}

const TURN_RIGHT = [new Vector(0, -1), new Vector(1, 0)];
const TURN_LEFT = [new Vector(0, 1), new Vector(-1, 0)];

class HullPaintingRobot {
  constructor() {
    this.position = new Vector(0, 0);
    this.direction = new Vector(0, -1);

    this.outputs = [];
    this.minX = 0;
    this.minY = 0;
    this.maxX = 0;
    this.maxY = 0;
  }

  paint(colour) {
    if (colour !== this.currentColour) {
      this.outputs.push(new PaintedPanel(this.position, colour));
      this.minX = Math.min(this.minX, this.position.x);
      this.minY = Math.min(this.minY, this.position.y);
      this.maxX = Math.max(this.maxX, this.position.x);
      this.maxY = Math.max(this.maxY, this.position.y);
    }
  }

  turnAndMove(dir) {
    const rotate = dir === 1 ? TURN_RIGHT : TURN_LEFT;
    this.direction = this.direction.multiply(...rotate);
    this.position = this.position.add(this.direction);
  }

  get currentColour() {
    const panels = this.outputs.filter((it) => this.position.equals(it));
    return panels.length ? panels.pop().colour : 0;
  }

  get grid() {
    const xRange = this.maxX + 1 - this.minX;
    const yRange = this.maxY + 1 - this.minY;
    const grid = new Array(yRange * xRange).fill('.');

    this.outputs.forEach(({ x, y }) => {
      grid[y * xRange + x] = '#';
    });

    return { grid, width: xRange };
  }
}

export class Question extends IntcodeQuestion {
  constructor() {
    super(2019, 11, 2160, 'LRZECGFE');
  }

  runRobot(robot, comp, override) {
    comp.toOutput(override || robot.currentColour);
    robot.paint(comp.output);
    comp.toOutput(override || robot.currentColour);
    robot.turnAndMove(comp.output);
  }

  part1(input) {
    const robot = new HullPaintingRobot();
    while (!input.terminated) this.runRobot(robot, input);
    return robot.outputs.filter((it, ix, arr) => !arr.slice(0, ix).some((tgt) => tgt.equals(it))).length;
  }

  part2(input) {
    const robot = new HullPaintingRobot();

    this.runRobot(robot, input, 1);
    while (!input.terminated) this.runRobot(robot, input);

    const { grid, width } = robot.grid;
    const slices = letterSlice(grid, width, 5);
    printLetters(grid, width);

    const letters = slices.map((it) => getLetter(it));
    return letters.join('');
  }
}
