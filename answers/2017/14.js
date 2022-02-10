import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { knotHash } from './knot-hash/knot-hash.js';
import { buildAdjacencyMap } from '../../utils/grid-utils.js';

const ADJACENCY_MAP = buildAdjacencyMap({ width: 128, height: 128, adjacency: 4 });

export class Question extends QuestionBase {
  constructor() {
    super(2017, 14, 8292, 1069);

    this.exampleInput({ input: 'flqrgnkx', part1: 8108, part2: 1242 });
  }

  get parser() {
    return Parsers.SINGLE_STRING;
  }

  toGrid(input) {
    return Array.from({ length: 128 }, (_, i) => `${input}-${i}`).flatMap((key) => {
      const hash = knotHash(key);
      const bits = hash.split('').map((it) => parseInt(it, 16).toString(2).padStart(4, '0'));
      return bits.flatMap((it) => it.split('').map(Number));
    });
  }

  get grid() {
    if (!this._grid) {
      this._grid = this.toGrid(this.input);
    }
    return this._grid;
  }

  findGroup(grid, start = grid.findIndex((it) => it), group = [start]) {
    const neighbours = ADJACENCY_MAP[start].filter((it) => grid[it] && !group.includes(it));
    const { group: gp, rest: rst } = neighbours.reduce(({ group: g }, n) => this.findGroup(grid, n, [...g, n]), {
      group,
      rest: grid,
    });
    const rest = rst.map((it, ix) => (it && gp.includes(ix) ? 0 : it));
    return { group: gp, rest };
  }

  part1() {
    return this.grid.filter((it) => it).length;
  }

  part2() {
    const groups = [];
    let grid = this.grid;
    while (grid.some((it) => it)) {
      const { group, rest } = this.findGroup(grid);
      groups.push(group);
      grid = rest;
    }
    return groups.length;
  }
}
