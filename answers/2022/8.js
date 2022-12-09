import { Parsers, QuestionBase } from '../../utils/question-base.js';
import { Vector } from '../../utils/vector.js';

export class Question extends QuestionBase {
  constructor() {
    super(2022, 8, 1823, 211680);

    this.exampleInput({ filename: '8a', part1: 21, part2: 8 });
  }

  get parser() {
    return Parsers.GRID;
  }

  parseValue(height, x, y) {
    return new Vector(x, y, Number(height));
  }

  postParse({ grid: trees }) {
    return trees.reduce((rcs, t) => {
      if (rcs.rows.length === t.y) rcs.rows.push([]);
      if (rcs.cols.length === t.x) rcs.cols.push([]);
      rcs.rows[t.y].push(t);
      rcs.cols[t.x].push(t);
      return rcs;
    }, { rows: [], cols: [], trees });
  }

  visibleFromDirection(tree, trees) {
    return trees.every(({ z }) => z < tree.z);
  }

  isVisible(tree, row, col) {
    return [
      col.slice(0, tree.y),
      col.slice(tree.y + 1),
      row.slice(0, tree.x),
      row.slice(tree.x + 1)
    ].some((dir) => this.visibleFromDirection(tree, dir));
  }

  countVisible(tree, trees) {
    let i = 0;
    while (i < trees.length && trees[i].z < tree.z) i += 1;
    return Math.min(trees.length, i + 1);
  }

  scenicScore(tree, row, col) {
    return [
      col.slice(0, tree.y).reverse(),
      col.slice(tree.y + 1),
      row.slice(0, tree.x).reverse(),
      row.slice(tree.x + 1)
    ].map((dir) => this.countVisible(tree, dir))
      .reduce((a, b) => a * b, 1);
  }

  part1({ rows, cols, trees }) {
    return trees.filter((tree) => this.isVisible(tree, rows[tree.y], cols[tree.x])).length;
  }

  part2({ rows, cols, trees }) {
    return trees.map((tree) => this.scenicScore(tree, rows[tree.y], cols[tree.x])).reduce((a, b) => Math.max(a, b), 0);
  }
}
