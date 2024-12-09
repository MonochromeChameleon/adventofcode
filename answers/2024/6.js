import { Parsers, QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2024, 6, 4826, 1721);

    this.exampleInput({ part1: 41, part2: 6 });
  }

  get parser() {
    return Parsers.GRID;
  }

  getNextLocation(from, direction, grid, width, directions) {
    if (Math.floor(from / width) === 0 && direction === 0) return { direction };
    if (from % width === width - 1 && direction === 1) return { direction };
    if (Math.floor(from / width) === Math.floor((grid.length - 1) / width) && direction === 2) return { direction };
    if (from % width === 0 && direction === 3) return { direction };

    const turns = [];

    let dir = direction;
    while (grid[from + directions[dir]] === '#') {
      dir = (dir + 1) % 4
      turns.push(from);
    }

    return { location: from + directions[dir], direction: dir, turns };
  }

  traverseMap({ grid, width }) {
    const UP = -width;
    const RIGHT = 1;
    const DOWN = width;
    const LEFT = -1;

    const DIRECTIONS = [UP, RIGHT, DOWN, LEFT];

    let location = grid.indexOf('^');
    let direction = 0;
    let t;
    const visited = {};
    const turns = []

    while (location !== undefined && !visited[location]?.includes(direction)) {
      visited[location] ||= [];
      visited[location].push(direction);

      ({ location, direction, turns: t = [] } = this.getNextLocation(location, direction, grid, width, DIRECTIONS));
      turns.push(...t);
    }

    return { visited, turns, loop: location !== undefined };
  }

  part1({ grid, width }) {
    const { visited } = this.traverseMap({ grid, width });
    return Object.keys(visited).length;
  }

  part2({ grid, width }) {
    const walls = grid.map((g, ix) => ix)
      .filter((ix) => grid[ix] === '.')
      .filter((ix) => {
        const newGrid = [...grid];
        newGrid[ix] = '#';
        const { loop } = this.traverseMap({ grid: newGrid, width });
        return loop;
    });

    const { turns } = this.traverseMap({ grid, width });
    const turnCoords = turns.map((t) => [t % width, Math.floor(t / width)]);

    const groups = this.findPossibleLoopGroups(turnCoords, grid);
    const cleverCandidates = groups.map(([[ax, ay], [bx, by], [cx, cy]]) =>  (bx === cx) ? [ax, cy] : [cx, ay]).map(([x, y]) => x + (y * width));

    if (width === 10) {
      console.log('DUH', cleverCandidates.sort((a, b) => a - b));
      console.log('WHOOP', walls);
      console.log('BUM', walls.filter((ww) => !cleverCandidates.includes(ww)));
      console.log('NAH', cleverCandidates.filter((cc) => !walls.includes(cc)));
    }

    return walls.length;
  }


  closeLoop([ax, ay], [bx, by], [cx, cy], width) {
    const [dx, dy] = (bx === cx) ? [ax, cy] : [cx, ay];

    const dxtoax = Array.from({ length: Math.abs(dx - ax) }, (_, ix) => [Math.min(dx, ax) + ix, dy]);
    const dytoay = Array.from({ length: Math.abs(dy - ay) }, (_, ix) => [dx, Math.min(dy, ay) + ix]);
    const dxtocx = Array.from({ length: Math.abs(dx - cx) }, (_, ix) => [Math.min(dx, cx) + ix, dy]);
    const dytocy = Array.from({ length: Math.abs(dy - cy) }, (_, ix) => [dx, Math.min(dy, cy) + ix]);

    const allSquares = [[dx, dy], ...dxtoax, ...dytoay, ...dxtocx, ...dytocy];
    return allSquares.map(([x, y]) => x + (y * width));
  }

  isRightTurn([fx, fy], [cx, cy], [tx, ty], grid) {
    if (fx === cx) {
      if (cy > fy) return tx < cx;
      if (cy < fy) return tx > cx;
    }
    if (fy === cy) {
      if (cx > fx) return ty > cy;
      if (cx < fx) return ty < cy;
    }
    return false;
  }

  canCloseLoop(corners, grid, width) {
    const [[ax, ay], [bx, by], [cx, cy]] = corners;
    const [dx, dy] = (bx === cx) ? [ax, cy] : [cx, ay];

    if (!this.isRightTurn([cx, cy], [dx, dy], [ax, ay], grid)) return false;

    const path = this.closeLoop(...corners, width);
    return path.every((p) => grid[p] !== '#');
  }

  findPossibleLoopGroups(turns, grid) {
    const maxLoops = Math.floor((turns.length + 1) / 4);
    return Array.from({ length: maxLoops }, (_, ix) => ix)
      .flatMap((l) => Array.from({ length: turns.length - 2 - (4 * l) }, (_, ix) => [turns[ix], ...turns.slice(ix + 1 + (4 * l), ix + 3 + (4 * l))]));
  }

  partTooClever({ grid, width }) {
    // 418 too low
    // 2592 too high obvs
    const { turns } = this.traverseMap({ grid, width });
    const turnCoords = turns.map((t) => [t % width, Math.floor(t / width)]);

    const groups = this.findPossibleLoopGroups(turnCoords, grid);
    return groups.filter((g) => this.canCloseLoop(g, grid, width)).length;
  }
}
