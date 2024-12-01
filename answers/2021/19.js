import { QuestionBase } from '../../utils/question-base.js';
import { triangle } from '../../utils/triangle-utils.js';
import { countByValue } from '../../utils/count-by-value.js';

const NUM_REQUIRED_MATCHES = triangle(11) * 2;

const VALID_ORIENTATIONS = [
  'x:y:z',
  'x:-z:y',
  'x:-y:-z',
  'x:z:-y',
  'y:-x:z',
  'y:-z:-x',
  'y:x:-z',
  'y:z:x',
  'z:x:y',
  'z:-y:x',
  'z:-x:-y',
  'z:y:-x',
  '-x:y:-z',
  '-x:z:y',
  '-x:-y:z',
  '-x:-z:-y',
  '-y:x:z',
  '-y:-z:x',
  '-y:-x:-z',
  '-y:z:-x',
  '-z:y:x',
  '-z:-x:y',
  '-z:-y:-x',
  '-z:x:-y',
];

class Point {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  get manhattan() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }

  equals(other) {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  difference(other) {
    return new Point(other.x - this.x, other.y - this.y, other.z - this.z);
  }

  add(other) {
    return new Point(this.x + other.x, this.y + other.y, this.z + other.z);
  }
}

function rotate(orientation) {
  const [ox, oy, oz] = orientation.split(':');

  const mx = ox.startsWith('-') ? -1 : 1;
  const my = oy.startsWith('-') ? -1 : 1;
  const mz = oz.startsWith('-') ? -1 : 1;

  const x = ox.replace('-', '');
  const y = oy.replace('-', '');
  const z = oz.replace('-', '');

  return (point) => new Point(point[x] * mx, point[y] * my, point[z] * mz);
}

const ROTATIONS = VALID_ORIENTATIONS.reduce((out, o) => ({ ...out, [o]: rotate(o) }), {});

class Vector extends Point {
  constructor(first, second) {
    super(first.x - second.x, first.y - second.y, first.z - second.z);
    this.start = first;
  }

  findOrientations(rp) {
    const xs = ['x', '-x', 'y', '-y', 'z', '-z'].filter(
      (axis, ix) => rp[axis.replace('-', '')] === this.x * (ix % 2 ? -1 : 1),
    );
    const ys = ['x', '-x', 'y', '-y', 'z', '-z'].filter(
      (axis, ix) => rp[axis.replace('-', '')] === this.y * (ix % 2 ? -1 : 1),
    );
    const zs = ['x', '-x', 'y', '-y', 'z', '-z'].filter(
      (axis, ix) => rp[axis.replace('-', '')] === this.z * (ix % 2 ? -1 : 1),
    );

    return xs
      .flatMap((x) =>
        ys.filter((y) => y !== x).flatMap((y) => zs.filter((z) => z !== x && z !== y).map((z) => `${x}:${y}:${z}`)),
      )
      .filter((o) => VALID_ORIENTATIONS.includes(o));
  }

  findMatches(relativePositions) {
    return relativePositions
      .filter((rp) => this.manhattan === rp.manhattan)
      .map((rp) => ({
        first: this,
        second: rp,
        orientations: this.findOrientations(rp),
      }));
  }
}

class Scanner {
  constructor(id) {
    this.id = id;
    this.beacons = [];

    this.scanners = {
      0: new Point(0, 0, 0),
    };
  }

  calculateRelativePositions() {
    this.relativePositions = this.beacons
      .flatMap((b1) => this.beacons.map((b2) => (b1 === b2 ? undefined : new Vector(b1, b2))))
      .filter((it) => it);
  }

  translate(rotation, delta) {
    this.beacons = this.beacons.map((b) => rotation(b).add(delta));
    this.calculateRelativePositions();
  }

  add(other) {
    const matches = this.relativePositions.flatMap((rp) => rp.findMatches(other.relativePositions));
    const counts = countByValue(matches.flatMap(({ orientations }) => orientations));
    const rotation = Object.keys(counts).find((axis) => counts[axis] >= NUM_REQUIRED_MATCHES);

    if (!rotation) {
      return false;
    }

    const [{ first, second }] = matches.filter(({ orientations }) => orientations.includes(rotation));
    const delta = ROTATIONS[rotation](second.start).difference(first.start);

    other.translate(ROTATIONS[rotation], delta);

    const otherBeacons = other.beacons.filter((b) => !this.beacons.some((b2) => b2.equals(b)));
    this.beacons.push(...otherBeacons);
    this.scanners[other.id] = delta;

    this.relativePositions.push(...other.relativePositions);

    return true;
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2021, 19, 381, 12201);

    this.exampleInput({ part1: 79, part2: 3621 });
  }

  parseInput(lines) {
    const scanners = lines.reduce((ss, line) => {
      if (/--- scanner (\d+) ---/.test(line)) {
        ss.unshift(new Scanner(ss.length));
      } else {
        ss[0].beacons.push(new Point(...line.split(',').map(Number)));
      }
      return ss;
    }, []);

    scanners.forEach((it) => it.calculateRelativePositions());

    return scanners.reverse();
  }

  part1(input) {
    let [s0, ...scanners] = input;  
    while (scanners.length) {
      scanners = scanners.filter((it) => !s0.add(it));
    }

    return s0.beacons.length;
  }

  part2([s0]) {
    const scannerPoints = Object.values(s0.scanners);
    const vectors = scannerPoints.flatMap((s1) => scannerPoints.map((s2) => s1.difference(s2)));
    const manhattans = vectors.map((v) => v.manhattan);
    return Math.max(...manhattans);
  }
}
