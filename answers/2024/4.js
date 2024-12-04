import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { cartesianProduct, permutations } from '../../utils/array-utils.js';

export class Question extends QuestionBase {
  constructor() {
    super(2024, 4, 2618, 2011);

    this.exampleInput({ part1: 18, part2: 9 });
  }

  get parser() {
    return Parsers.GRID;
  }

  get adjacency() {
    return 0;
  }

  hasMatch(ix, grid, offset, tgt, ...targets) {
    const offix = ix + offset;
    if (offix < 0 || offix >= grid.length || grid[offix] !== tgt) return false;
    if (!targets.length) return true;
    return this.hasMatch(offix, grid, offset, ...targets);
  }

  noWrap(ix, gridSize, width, offset) {
    const endex = ix + (3 * offset);
    const icol = ix % width;
    const ecol = endex % width;
    const irow = Math.floor(ix / width);
    const erow = Math.floor(endex / width);

    if (erow < 0 || ecol < 0 || erow >= gridSize || ecol >= gridSize) return false;
    if (icol === ecol) return Math.abs(irow - erow) === 3;
    if (irow === erow) return Math.abs(icol - ecol) === 3;
    return Math.abs(irow - erow) === 3 && Math.abs(icol - ecol) === 3;
  }

  insetOne(ix, gridSize, width) {
    return Math.floor(ix / width) > 0 && ix % width > 0 && Math.floor(ix / width) < (gridSize / width) - 1 && ix % width < width - 1
  }

  part1({ grid, width }) {
    const xs = grid.map((c, ix) => c === 'X' ? ix : undefined).filter((ix) => ix !== undefined);
    const offsets = cartesianProduct([[1, 0, -1], [width, 0, -width]]).map(([a, b]) => a + b).filter(Boolean).sort();

    return xs.flatMap((xix) => {
      const validOffsets = offsets.filter((offset) => this.noWrap(xix, grid.length, width, offset));
      return validOffsets.filter((offset) => this.hasMatch(xix, grid, offset, 'M', 'A', 'S'));
    }).length;
  }

  part2({ grid, width }) {
    const as = grid.map((c, ix) => c === 'A' ? ix : undefined)
      .filter((ix) => ix !== undefined);

    const validAs = as.filter((ix) => this.insetOne(ix, grid.length, width));
    const corners = cartesianProduct([[1, -1], [width, -width]]).map(([a, b]) => a + b).filter(Boolean).sort((a, b) => a - b);

    return validAs.filter((aix) => {
      const cornerChars = corners.map((c) => grid[aix + c]);
      if (cornerChars.toSorted().join('') !== 'MMSS') return false;
      return cornerChars[0] === 'M' ? cornerChars[3] === 'S' : cornerChars[3] === 'M';
    }).length;
  }
}
