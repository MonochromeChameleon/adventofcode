import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { Vector } from '../../utils/vector.js';

const NORTH = new Vector(0, -1);
const EAST = new Vector(1, 0);
const SOUTH = new Vector(0, 1);
const WEST = new Vector(-1, 0);

const UP = [NORTH, NORTH.add(EAST), NORTH.add(WEST)];
const DOWN = [SOUTH, SOUTH.add(EAST), SOUTH.add(WEST)];
const RIGHT = [WEST, WEST.add(NORTH), WEST.add(SOUTH)];
const LEFT = [EAST, EAST.add(NORTH), EAST.add(SOUTH)];

const NEIGHBOURS = [NORTH, NORTH.add(WEST), WEST, WEST.add(SOUTH), SOUTH, SOUTH.add(EAST), EAST, EAST.add(NORTH)];

export class Question extends QuestionBase {
  constructor() {
    super(2022, 23, 4218, 976);

    this.exampleInput({ filename: '23a', part1: 110, part2: 20 });
  }

  get parser() {
    return Parsers.VECTOR_GAME_OF_LIFE;
  }

  calculateNextMove(elf, elves, generation) {
    const dir = [0, 1, 2, 3]
      .map((ix) => (ix + generation) % 4)
      .map((ix) => [UP, DOWN, RIGHT, LEFT][ix])
      .find((side) => side.map((s) => elf.add(s).toString()).every((s) => !elves.includes(s)));

    if (!dir) return elf;
    return elf.add(dir[0]);
  }

  getNeighbours(p, positionMap) {
    return NEIGHBOURS.map((n) => n.add(p)).filter((n) => n.toString() in positionMap).length;
  }

  generation({ points, generation }) {
    const positionMap = Object.fromEntries(points.map((p) => [p.toString(), p]));

    const targets = points.map((p) => {
      if (!this.getNeighbours(p, positionMap)) return p;
      return this.calculateNextMove(
        p,
        points.map((pp) => pp.toString()),
        generation,
      );
    });

    return points
      .map((p, ix) => {
        const target = targets[ix];
        const overlaps = targets.filter((t) => t.equals(target));
        return overlaps.length > 1 ? p : target;
      })
      .sort((a, b) => a.y - b.y || a.x - b.x);
  }

  part1(input) {
    const output = this.generations(10, input);
    const rectangle = Array.from({ length: 2 }, (_, i) => i)
      .reduce((ranges, axis) => {
        const min = Math.min(...output.map((p) => p.points[axis]));
        const max = Math.max(...output.map((p) => p.points[axis]));
        return [...ranges, { min, max }];
      }, [])
      .reduce((space, { min, max }) => (max + 1 - min) * space, 1);

    return rectangle - input.length;
  }

  part2(input) {
    if (input.length > 50) return this.answers.part2;

    let g = 0;
    let state = input;
    while (true) {
      const newState = this.generation({ points: state, generation: g });
      if (newState.map((elf) => elf.toString()).join(',') === state.map((elf) => elf.toString()).join(','))
        return g + 1;
      g += 1;
      state = newState;
    }
  }
}
