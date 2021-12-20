import { QuestionBase } from '../utils/question-base.js';
import { triangle } from '../utils/triangle-utils.js';

const NUM_REQUIRED_MATCHES = triangle(11) * 2;
const VALID_ORIENTATIONS = [
  'x:y:z', 'x:-z:y', 'x:-y:-z', 'x:z:-y',
  'y:-x:z', 'y:-z:-x', 'y:x:-z', 'y:z:x',
  'z:x:y', 'z:-y:x', 'z:-x:-y', 'z:y:-x',
  '-x:y:-z', '-x:z:y', '-x:-y:z', '-x:-z:-y',
  '-y:x:z', '-y:-z:x', '-y:-x:-z', '-y:z:-x',
  '-z:y:x', '-z:-x:y', '-z:-y:-x', '-z:x:-y',
];

function rotate (orientation) {
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

class Point {
  constructor (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  get manhattan () {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }

  equals (other) {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  difference (other) {
    return new Point(other.x - this.x, other.y - this.y, other.z - this.z);
  }

  add (other) {
    return new Point(this.x + other.x, this.y + other.y, this.z + other.z);
  }
}

class Scanner {
  constructor (id) {
    this.id = id;
    this.beacons = [];
    this.combined = [id];

    this.scanners = {
      0: new Point(0, 0, 0),
    };
  }

  calculateRelativePositions () {
    this.relativePositions = this.beacons.flatMap((b1) => this.beacons.map((b2) => b1 === b2 ? undefined : b2.difference(b1)).filter(it => it));
    return this;
  }

  calculateRotations () {
    if (!this.id) {
      return [this];
    }
    return VALID_ORIENTATIONS.map((orientation, ix) => ix ? this.rotate(orientation) : this);
  }

  overlaps (other) {
    return other.relativePositions.reduce((rpbo, rp) => {
      if (this.relativePositions.some(r => r.equals(rp))) {
        rpbo.yes.push(rp);
      } else {
        rpbo.no.push(rp);
      }
      return rpbo;
    }, { yes: [], no: [] });
  }

  rotate (orientation) {
    const r = ROTATIONS[orientation];
    const rotatedBeacons = this.beacons.map(r);
    const rotatedRelativePositions = this.relativePositions.map(r);
    const s = new Scanner(this.id);
    s.beacons = rotatedBeacons;
    s.relativePositions = rotatedRelativePositions;

    return s;
  }

  translate (delta) {
    return this.beacons.map(b => b.add(delta));
  }

  add (other) {
    if (this.combined.includes(other.id)) return false;

    for (let ix = 0; ix < this.beacons.length; ix += 1) {
      const thisBeacon = this.beacons[ix];
      for (let ox = 0; ox < other.beacons.length; ox += 1) {
        const otherBeacon = other.beacons[ox];
        const translation = otherBeacon.difference(thisBeacon);
        const translated = other.translate(translation);
        const beaconsByOverlap = translated.reduce((bbo, b) => {
          if (this.beacons.some(bb => bb.equals(b))) {
            bbo.yes.push(b);
          } else {
            bbo.no.push(b);
          }
          return bbo;
        }, { yes: [], no: [] });

        if (beaconsByOverlap.yes.length >= 12) {
          this.beacons.push(...beaconsByOverlap.no);
          this.combined.push(other.id);
          this.scanners[other.id] = translation;
          return true;
        }
      }
    }

    return false;
  }
}

export class Question extends QuestionBase {
  constructor (args) {
    super(19, 79, 381, 3621, 12201, args);
  }

  parseInput (lines) {
    const scanners = lines.reduce((ss, line) => {
      if (/--- scanner (\d+) ---/.test(line)) {
        ss.unshift(new Scanner(ss.length));
      } else {
        ss[0].beacons.push(new Point(...line.split(',').map(Number)));
      }
      return ss;
    }, []);

    scanners.forEach(it => it.calculateRelativePositions());
    return scanners.reverse().flatMap(it => it.calculateRotations());
  }

  part1 (input) {
    let [s0, ...scanners] = input.slice(0);

    while (scanners.length) {
      const overlap = scanners.reduce((r, s) => {
        if (r) return r;
        const ooo = s0.overlaps(s);
        if (ooo.yes.length >= NUM_REQUIRED_MATCHES) {
          return { ...ooo, s };
        }
        return null;
      }, null);
      if (overlap) {
        s0.add(overlap.s);
        s0.relativePositions.push(...overlap.no);
      }
      scanners = scanners.filter(it => !s0.combined.includes(it.id));
    }

    return s0.beacons.length;
  }

  part2 ([s0]) {
    const scannerPoints = Object.values(s0.scanners);
    const vectors = scannerPoints.flatMap(s1 => scannerPoints.map(s2 => s1.difference(s2)));
    const manhattans = vectors.map(v => v.manhattan);
    return Math.max(...manhattans);
  }
}
