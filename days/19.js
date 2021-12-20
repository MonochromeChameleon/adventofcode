import { QuestionBase } from '../utils/question-base.js';
import { triangle } from '../utils/triangle-utils.js';
import { countByValue } from '../utils/count-by-value.js';

const NUM_REQUIRED_MATCHES = triangle(11) * 2;

function getTransformFunction({ first, second }, orientation) {
  const [ox, oy, oz] = orientation.split(':');

  const mx = ox.startsWith('-') ? -1 : 1;
  const my = oy.startsWith('-') ? -1 : 1;
  const mz = oz.startsWith('-') ? -1 : 1;

  const x = ox.replace('-', '');
  const y = oy.replace('-', '');
  const z = oz.replace('-', '');

  const swapAxes = (beacon) => new Point(beacon[x] * mx, beacon[y] * my, beacon[z] * mz);

  const f1 = first.first;
  const f2 = first.second;
  const s1 = swapAxes(second.first);
  const s2 = swapAxes(second.second);

  const applyDeltas = (beacon) => new Point(beacon.x + f1.x - s1.x, beacon.y + f1.y - s1.y, beacon.z + f1.z - s1.z);

  if (!applyDeltas(s2).equals(f2)) {
    throw new Error('poop');
  }

  return (beacon) => applyDeltas(swapAxes(beacon));
}

const VALID_TRANSFORMS = [
  'x:y:z', 'x:-z:y', 'x:-y:-z', 'x:z:-y',
  'y:-x:z', 'y:-z:-x',  'y:x:-z', 'y:z:x',
  'z:x:y', 'z:-y:x', 'z:-x:-y', 'z:y:-x',
  '-x:y:-z', '-x:z:y', '-x:-y:z', '-x:-z:-y',
  '-y:x:z', '-y:-z:x', '-y:-x:-z', '-y:z:-x',
  '-z:y:x', '-z:-x:y', '-z:-y:-x', '-z:x:-y'
]

class Pair {
  constructor(first, second) {
    this.first = first;
    this.second = second;

    this.x = first.x - second.x;
    this.y = first.y - second.y;
    this.z = first.z - second.z;

    this.maybeEquality = [Math.abs(this.x), Math.abs(this.y), Math.abs(this.z)].sort((a, b) => a - b);
  }

  mightBeEqual(pair) {
    const [aa, bb, cc] = this.maybeEquality;
    const [dd, ee, ff] = pair.maybeEquality;
    return aa === dd && bb === ee && cc === ff;
  }

  findOrientations(rp) {
    const xs = ['x', '-x', 'y', '-y', 'z', '-z'].filter((axis, ix) => rp[axis.replace('-','')] === (this.x * (ix % 2 ? -1 : 1)));
    const ys = ['x', '-x', 'y', '-y', 'z', '-z'].filter((axis, ix) => rp[axis.replace('-','')] === (this.y * (ix % 2 ? -1 : 1)));
    const zs = ['x', '-x', 'y', '-y', 'z', '-z'].filter((axis, ix) => rp[axis.replace('-','')] === (this.z * (ix % 2 ? -1 : 1)));

    return xs.flatMap((x) => ys.filter((y) => y !== x).flatMap((y) => zs.filter((z) => z !== x && z !== y).map((z) => `${x}:${y}:${z}`))).filter((o) => VALID_TRANSFORMS.includes(o));
  }

  findMatches(relativePositions) {
    const rps = relativePositions.filter(rp => this.mightBeEqual(rp));
    return rps.map((rp) => ({
      first: this,
      second: rp,
      orientations: this.findOrientations(rp),
    }));
  }
}

class Point {
  constructor (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  equals(other) {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }
}

class Scanner {
  constructor (id) {
    this.id = id;
    this.beacons = [];
  }

  addBeacon (newBeacon) {
    if (this.beacons.some(b => b.equals(newBeacon))) {
      return;
    }
    this.beacons.push(newBeacon);
  }

  calculateRelativePositions () {
    this.relativePositions = this.beacons.flatMap((b1) => this.beacons.map((b2) => b1 === b2 ? undefined : new Pair(b1, b2))).filter(it => it);
  }

  add(other) {
    const matches = this.relativePositions.flatMap((rp) => rp.findMatches(other.relativePositions));
    const counts = countByValue(matches.flatMap(({ orientations }) => orientations));
    const maxOverlap = Math.max(...Object.values(counts));

    if (maxOverlap < NUM_REQUIRED_MATCHES) {
      return false;
    }

    const transform = Object.keys(counts).filter((axis) => counts[axis] >= NUM_REQUIRED_MATCHES).find((t) => {
      const pairPairs = matches.filter(({ orientations }) => orientations.includes(t));
      const transformFunction = getTransformFunction(pairPairs[0], t);

      const mismatches = pairPairs.filter(({ first, second }) => {
        const s1 = transformFunction(second.first);
        const s2 = transformFunction(second.second);

        return (!first.first.equals(s1) || !first.second.equals(s2));
      });

      return mismatches.length === 0;
    });

    const [match] = matches.filter(({ orientations }) => orientations.includes(transform));
    const transformFunction = getTransformFunction(match, transform);

    other.beacons.forEach((b) => this.addBeacon(transformFunction(b)));
    this.calculateRelativePositions();

    return true;
  }
}

export class Question extends QuestionBase {
  constructor (args) {
    super(19, 79, undefined, undefined, undefined, args);
  }

  parseInput (lines) {
    const scanners = lines.reduce((ss, line) => {
      if (/--- scanner \d ---/.test(line)) {
        ss.unshift(new Scanner(ss.length));
      } else {
        ss[0].addBeacon(new Point(...line.split(',').map(Number)));
      }
      return ss;
    }, []);

    scanners.forEach(it => it.calculateRelativePositions());

    return scanners;
  }

  part1 (input) {
    let scanners = input.slice(0);
    while (scanners.length > 1) {
      const s = scanners.shift();
      scanners = scanners.filter(it => !s.add(it));
      scanners.push(s);
    }

    const [{ beacons }] = scanners;

    return beacons.length; // less than 708
  }

  part2 (input) {
    return input.reduce((a, b) => a + b, 0);
  }
}
