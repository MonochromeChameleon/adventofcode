import { Parsers, QuestionBase } from '../../utils/question-base.js';
import { Vector } from '../../utils/vector.js';

export class Question extends QuestionBase {
  constructor() {
    super(2023, 10, 6815, 269);

    this.exampleInput({ part1: 4 });
    this.exampleInput({ part1: 8 });
    this.exampleInput({ part2: 4 });
    this.exampleInput({ part2: 4 });
    this.exampleInput({ part2: 8 });
    this.exampleInput({ part2: 10 });
  }

  get parser() {
    return Parsers.GRID;
  }

  canMove(from, to, grid) {
    const charf = grid[from];
    const chart = grid[to];
    if (charf === '.' || chart === '.') return false;
    if (to - from === 1) return ['-', 'F', 'L', 'S'].includes(charf) && ['-', 'J', '7', 'S'].includes(chart);
    if (from - to === 1) return ['-', 'J', '7', 'S'].includes(charf) && ['-', 'F', 'L', 'S'].includes(chart);
    if (to > from) return ['|', 'F', '7', 'S'].includes(charf) && ['|', 'L', 'J', 'S'].includes(chart);
    if (from > to) return ['|', 'L', 'J', 'S'].includes(charf) && ['|', 'F', '7', 'S'].includes(chart);
  }

  buildRoute(ix, grid, adjacencyMap) {
    const visited = [];
    let next = ix;
    while (next) {
      visited.push(next);
      next = adjacencyMap[next]
        .filter((n) => !visited.includes(n))
        .find((n) => this.canMove(n, visited[visited.length - 1], grid));
    }
    return visited;
  }

  identifyS(route) {
    const [start, next] = route;
    const last = route[route.length - 1];
    if (next - start === 1) {
      if (start - last === 1) return '-';
      if (start > last) return 'L';
      return 'F';
    }
    if (start - next === 1) {
      if (last - start === 1) return '-';
      if (start > last) return 'J';
      return '7';
    }
    if (next > start) {
      if (start - last === 1) return '7';
      if (last - start === 1) return 'F';
      return '|';
    }
    if (next < start) {
      if (start - last === 1) return 'J';
      if (last - start === 1) return 'L';
      return '|';
    }
  }

  fillSimpleOutside(grid, adjacencyMap) {
    let changed = true;
    while (changed) {
      const { out: o, changes: cc } = grid.reduce(
        ({ out, changes }, c, ix) => {
          if (c !== '.') return { out, changes };
          const was = out[ix];
          if (adjacencyMap[ix].length < 4) out[ix] = 'O';
          if (adjacencyMap[ix].some((a) => out[a] === 'O')) out[ix] = 'O';
          return { out, changes: changes || out[ix] !== was };
        },
        { out: grid, changes: false },
      );
      grid = o;
      changed = cc;
    }

    return grid;
  }

  fillTrickyOutside(route, grid, width) {
    let direction = new Vector(1, 0);
    route.forEach((r) => {
      const c = grid[r];
      if (c === '-' && grid[r - width * direction.x] === '.') grid[r - width * direction.x] = 'O';
      if (c === '|' && grid[r + direction.y] === '.') grid[r + direction.y] = 'O';
      if (c === '7' || c === 'L') {
        [r + direction.x, r - width * direction.x]
          .filter((i) => grid[i] === '.')
          .forEach((i) => {
            grid[i] = 'O';
          });
        direction = new Vector(direction.y, direction.x);
      }
      if (c === 'J' || c === 'F') {
        [r + direction.y, r + width * direction.y]
          .filter((i) => grid[i] === '.')
          .forEach((i) => {
            grid[i] = 'O';
          });
        direction = new Vector(-direction.y, -direction.x);
      }
    });

    return grid;
  }

  part1({ grid, adjacencyMap }) {
    const six = grid.findIndex((c) => c === 'S');
    const route = this.buildRoute(six, grid, adjacencyMap);
    return Math.ceil(route.length / 2);
  }

  part2({ grid, adjacencyMap, width }) {
    const six = grid.findIndex((c) => c === 'S');
    const route = this.buildRoute(six, grid, adjacencyMap);
    const s = this.identifyS(route);
    const cleanGrid = grid.map((c, ix) => (route.includes(ix) ? (ix === route[0] ? s : c) : '.'));
    const simpleOutside = this.fillSimpleOutside(cleanGrid, adjacencyMap);
    // Find a start point which is travelling to the right with an outside above it
    const startIndex = route.findIndex(
      (r) => simpleOutside[r] === '-' && (r < width || simpleOutside[r - width] === 'O'),
    );
    const [start, ...rest] = [...route.slice(startIndex), ...route.slice(0, startIndex)];
    const simplestRoute = rest[0] === start + 1 ? [start, ...rest] : [start, ...rest.toReversed()];
    return this.fillTrickyOutside(simplestRoute, simpleOutside, width).filter((c) => c === '.').length;
  }
}
