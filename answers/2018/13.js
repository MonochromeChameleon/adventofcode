import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { CircularLinkedList } from '../../utils/linked-list.js';
import { Vector } from '../../utils/vector.js';

const UP = new Vector(0, -1);
const RIGHT = new Vector(1, 0);
const DOWN = new Vector(0, 1);
const LEFT = new Vector(-1, 0);

const DIRECTIONS = new CircularLinkedList(UP, RIGHT, DOWN, LEFT);

const JUNC_LEFT = (node) => node.prev;
const JUNC_RIGHT = (node) => node.next;
const JUNC_STRAIGHT = (node) => node;

const JUNCTIONS = new CircularLinkedList(JUNC_LEFT, JUNC_STRAIGHT, JUNC_RIGHT);

const charToDir = (char) => {
  switch (char) {
    case '^':
      return DIRECTIONS.head;
    case '>':
      return DIRECTIONS.head.next;
    case 'v':
      return DIRECTIONS.head.next.next;
    case '<':
      return DIRECTIONS.head.next.next.next;
    default:
      throw new Error(`Invalid direction: ${char}`);
  }
};

class Kart {
  constructor(direction, x, y, track) {
    this.direction = charToDir(direction);
    this.junction = JUNCTIONS.head;

    this.position = new Vector(x, y);
    this.id = track.karts.length + 1;
    this.track = track;
    this.destroyed = false;

    this.reset = () => {
      this.direction = charToDir(direction);
      this.junction = JUNCTIONS.head;

      this.position = new Vector(x, y);
    };
  }

  get ix() {
    return this.y * this.track.width + this.x;
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  collision(other) {
    return this !== other && this.position.equals(other.position);
  }

  annihilate(other) {
    if (this === other) {
      return false;
    }

    if (this.destroyed || other.destroyed) {
      return false;
    }

    if (this.ix === other.ix) {
      this.destroyed = true;
      other.destroyed = true;
      return true;
    }

    return false;
  }

  move() {
    this.position = this.position.add(this.direction.value);

    const isVertical = this.direction.value.x === 0;

    switch (this.track.at(this.position)) {
      case '\\':
        this.direction = isVertical ? this.direction.prev : this.direction.next;
        break;
      case '/':
        this.direction = isVertical ? this.direction.next : this.direction.prev;
        break;
      case '+':
        this.direction = this.junction.value(this.direction);
        this.junction = this.junction.next;
        break;
    }
  }

  toString() {
    if (this.destroyed) return '*';
    return this.id;
  }
}

const blankTrack = (c) => {
  switch (c) {
    case '<':
    case '>':
      return '-';
    case '^':
    case 'v':
      return '|';
    default:
      return c;
  }
};

class Track {
  constructor() {
    this.track = [];
    this.karts = [];
  }

  get width() {
    if (!this._width) {
      this._width = this.track.reduce((max, row) => Math.max(max, row.length), 0);
    }
    return this._width;
  }

  addLine(line) {
    const { karts: k, row: r } = line.split('').reduce(
      ({ karts, row }, c, ix) => {
        const blanked = blankTrack(c);
        if (blanked === c) return { karts, row: [...row, c] };

        const kart = new Kart(c, ix, this.track.length, this);
        return { karts: [...karts, kart], row: [...row, blanked] };
      },
      { karts: [], row: [] }
    );
    this.track.push(r);
    this.karts.push(...k);
  }

  at(position) {
    return this.track[position.y][position.x];
  }

  get collision() {
    return this.karts.find((kart, ix) => this.karts.slice(ix + 1).some((other) => kart.collision(other)));
  }

  get activeKarts() {
    return this.karts.filter(({ destroyed }) => !destroyed);
  }

  tick(stopOnCollision = true) {
    const orderedKarts = this.karts.filter(({ destroyed }) => !destroyed).sort((a, b) => a.ix - b.ix);

    for (let i = 0; i < orderedKarts.length && !(stopOnCollision && this.collision); i += 1) {
      const ok = orderedKarts[i];
      if (!ok.destroyed) {
        ok.move();
        const hit = orderedKarts.find((other) => ok.collision(other));
        if (hit) {
          hit.destroyed = true;
          ok.destroyed = true;
        }
      }
    }
  }

  reset() {
    this.karts.forEach(({ reset }) => reset());
  }

  toString() {
    const withKarts = this.track.map((row, y) =>
      row.map((c, x) => {
        const kart = this.karts.find((k) => k.x === x && k.y === y);
        return kart ? kart.toString() : c;
      })
    );

    return withKarts.map((row) => row.join('')).join('\n');
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2018, 13, '83,121', '102,144');

    this.exampleInput({ part1: '7,3' });
    this.exampleInput({ part2: '6,4' });
  }

  get parser() {
    return Parsers.REDUCE;
  }

  get reducer() {
    return Track;
  }

  reset(track) {
    track.reset();
  }

  part1(track) {
    while (!track.collision) {
      track.tick();
    }
    const { x, y } = track.collision;
    return `${x},${y}`;
  }

  part2(track) {
    while (track.activeKarts.length > 1) {
      track.tick(false);
    }

    const [{ x, y }] = track.activeKarts;
    return `${x},${y}`;
  }
}
