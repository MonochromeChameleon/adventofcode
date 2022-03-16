import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2018, 17, 39877, 33291);

    this.exampleInput({ part1: 57, part2: 29 });
  }

  get parser() {
    return Parsers.FLAT_MAP;
  }

  parseLine(line) {
    const [, xy, v, yx, ...rest] = /^(\w)=(\d+), (\w)=(\d+)\.\.(\d+)$/.exec(line);
    const [from, to] = rest.map(Number);
    return Array.from({ length: to + 1 - from }, (_, i) => ({ [xy]: Number(v), [yx]: from + i })).map(({ x, y }) => ({
      x,
      y,
    }));
  }

  fill(grid, sources, width) {
    const nextSources = sources.flatMap((ix) => {
      if (ix + width >= grid.length) return [];
      if (grid[ix + width] === '.') return ix + width;
      if (grid[ix + width] === '|') return [];
      return [ix - 1, ix + 1].filter((i) => grid[i] === '.');
    });

    const wall = (ix, step) => {
      if (grid[ix + step] === '.') return false;
      if (grid[ix + step] === '#') return true;
      return wall(ix + step, step);
    };

    const wallLeft = (ix) => wall(ix, -1);
    const wallRight = (ix) => wall(ix, 1);

    const pools = sources.filter((ix) => wallLeft(ix) && wallRight(ix));
    pools.forEach((ix) => {
      let left = ix;
      let right = ix;
      while (grid[left - 1] === '|') left -= 1;
      while (grid[right + 1] === '|') right += 1;
      for (let i = left; i <= right; i += 1) {
        grid[i] = '~';
        if (grid[i - width] === '|') nextSources.push(i - width);
      }
    });

    nextSources.forEach((ix) => {
      grid[ix] = '|';
    });
    return nextSources;
  }

  postParse(squares) {
    const xMin = Math.min(...squares.map(({ x }) => x));
    const xMax = Math.max(...squares.map(({ x }) => x));
    const yMin = Math.min(...squares.map(({ y }) => y));
    const yMax = Math.max(...squares.map(({ y }) => y));

    const width = xMax + 3 - xMin;
    const height = yMax + 1;
    const grid = new Array(width * height).fill('.');
    squares.forEach(({ x, y }) => {
      grid[y * width + x + 1 - xMin] = '#';
    });

    const tap = 501 - xMin;
    let sources = [tap];
    while (sources.length) {
      sources = this.fill(grid, sources, width);
    }

    return grid.filter((_, ix) => ix > yMin * width);
  }

  part1(grid) {
    return grid.filter((c) => c === '~' || c === '|').length;
  }

  part2(grid) {
    return grid.filter((c) => c === '~').length;
  }
}
