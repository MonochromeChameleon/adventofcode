import { Parsers, QuestionBase } from '../../utils/question-base.js';
import { printGrid } from '../../utils/grid-utils.js';

export class Question extends QuestionBase {
  constructor() {
    super(2024, 15, 1527563, 1521635);

    this.exampleInput({ part1: 2028 });
    this.exampleInput({ part1: 10092, part2: 9021 });
    this.exampleInput({ part2: 618 });
  }

  get parser() {
    return Parsers.MULTIPLE;
  }

  get parsers() {
    return {
      map: Parsers.GRID,
      movements: Parsers.FLAT_MAP
    };
  }

  parserGroup(line) {
    return line.startsWith('#') ? 'map' : 'movements';
  }

  postParsePart1({ map: { grid, ...rest }, movements }) {
    const start = grid.findIndex((it) => it === '@');
    const boxes = grid.map((it, ix) => it === 'O' ? [ix] : []).filter((it) => it.length);
    const map = grid.map((it) => it === '#' ? '#' : '.');
    return { start, map, boxes, movements, ...rest };
  }

  postParsePart2({ map: { grid, width, ...rest }, movements }) {
    const doubleGrid = grid.flatMap((g) => {
      switch (g) {
        case '@':
          return ['@', '.'];
        case 'O':
          return ['O', '.'];
        default:
          return [g, g];
      }
    });
    const start = doubleGrid.findIndex((it) => it === '@');
    const boxes = doubleGrid.map((it, ix) => it === 'O' ? [ix, ix + 1] : []).filter((it) => it.length);
    const map = doubleGrid.map((it) => it === '#' ? '#' : '.');
    return { start, map, boxes, movements, width: width * 2, ...rest };
  }

  getDelta(move, width) {
    switch (move) {
      case '^':
        return -width;
      case '>':
        return 1;
      case 'v':
        return width;
      case '<':
        return -1;
    }
  }

  moveBoxes(box, boxes, delta, map) {
    const movedBox = box.map((b) => b + delta);
    const otherBoxes = boxes.filter((b) => !b.some((bb) => box.includes(bb)));
    if (movedBox.some((b) => map[b] === '#')) return false;
    const cascadeBoxes = otherBoxes.filter((b) => b.some((bb) => movedBox.includes(bb)));
    const cascade = cascadeBoxes.reduce((out, casc) => out && this.moveBoxes(casc, out, delta, map), otherBoxes);
    return cascade && [movedBox, ...cascade];
  }

  move({ robot, boxes }, move, map, width) {
    const delta = this.getDelta(move, width);
    const newRobot = robot + delta;
    if (map[newRobot] === '#') return { robot, boxes };
    const moveBox = boxes.find((b) => b.includes(newRobot));
    if (!moveBox) return { robot: newRobot, boxes };
    const newBoxes = this.moveBoxes(moveBox, boxes, delta, map, width);
    return newBoxes ? { robot: newRobot, boxes: newBoxes } : { robot, boxes };
  }

  print(map, { robot, boxes }, width) {
    map[robot] = '@';
    boxes.forEach(([a, b]) => {
      map[a] = b ? '[' : 'O';
      if (b) map[b] = ']';
    });
    printGrid(map, width);
  }

  part1(input) {
    const { start, map, boxes, movements, width } = this.postParsePart1(input);
    const endState = movements.reduce((state, move) => this.move(state, move, map, width), {
      robot: start,
      boxes
    });
    this.print(map, endState, width);
    return endState.boxes.map(([bix]) => (100 * Math.floor(bix / width) + (bix % width))).reduce((a, b) => a + b, 0);
  }

  part2(input) {
    const { start, map, boxes, movements, width } = this.postParsePart2(input);
    const endState = movements.reduce((state, move) => this.move(state, move, map, width), {
      robot: start,
      boxes
    });

    this.print(map, endState, width);
    return endState.boxes.map(([bix]) => (100 * Math.floor(bix / width) + (bix % width))).reduce((a, b) => a + b, 0);
  }
}
