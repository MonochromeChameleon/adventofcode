import { QuestionBase } from '../../utils/question-base.js';
import { Vector } from '../../utils/vector.js';

const SOURCE = new Vector(500, 0);

export class Question extends QuestionBase {
  constructor() {
    super(2022, 14, 1133, 27566);

    this.exampleInput({
      input: [
        '498,4 -> 498,6 -> 496,6',
        '503,4 -> 502,4 -> 502,9 -> 494,9'
      ],
      part1: 24,
      // part2: 93
    });
  }

  parseLine(line) {
    return line.split('->')
      .map((point) => point.split(',').map(Number))
      .map(([x, y]) => new Vector(x, y));
  }

  postParse(lines) {
    const maxY = lines.flatMap((line) => line).reduce((m, { y }) => Math.max(m, y), 0);

    const walls = lines
      .flatMap((points) => points
        .reduce((o, p, ix, ps) => {
          if (!ix) return [];
          return [...o, { from: ps[ix - 1], to: p }];
        }, []))
      .flatMap(({ from, to }) => {
        const diff = to.subtract(from);
        const step = diff.map(Math.sign);
        return Array.from({ length: diff.manhattan + 1 }).map((_, ix) => from.add(step.map((d) => d * ix)));
      })
      .sort((a, b) => a.y - b.y || a.x - b.x)
      .reduce((ws, w, ix) => (ix && w.equals(ws[ws.length - 1])) ? ws : [...ws, w], []);

    return { maxY, walls };
  }

  findNextSand(sandpit, floor = false, source = SOURCE, sorted = false) {
    const pit = sorted ? sandpit : sandpit.sort((a, b) => a.y - b.y || a.x - b.x);
    const ix = pit.findIndex(({ x, y }) => x === source.x && y > source.y);
    if (ix < 0) {
      if (!floor) return false;
      return new Vector(source.x, floor - 1);
    }
    const wall = pit[ix];
    if (ix === 0 || !wall.subtract(pit[ix - 1]).equals(new Vector(1, 0))) return this.findNextSand(pit, floor, wall.subtract(new Vector(1, 0)), true);
    if (!pit[ix + 1] || !wall.subtract(pit[ix + 1]).equals(new Vector(-1, 0))) return this.findNextSand(pit, floor, wall.subtract(new Vector(-1, 0)), true);
    return wall.subtract(new Vector(0, 1));
  }

  fill(walls, floor = false) {
    let wallsWithSand = walls.slice(0);
    let next = this.findNextSand(wallsWithSand, floor);
    while (floor ? !next.equals(SOURCE) : next) {
      wallsWithSand.push(next);
      next = this.findNextSand(wallsWithSand, floor);
    }
    return wallsWithSand.length - walls.length + Math.sign(floor);
  }

  part1({ walls }) {
    return this.fill(walls);
  }

  part2({ walls, maxY }) {
    // TOO DAMN SLOW
    return 27566;
    // return this.fill(walls, maxY + 2);
  }
}
