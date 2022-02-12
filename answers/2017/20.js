import { QuestionBase, Parsers } from '../../utils/question-base.js';

class Vector {
  constructor([x, y, z]) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(other) {
    return new Vector([
      this.x + other.x,
      this.y + other.y,
      this.z + other.z
    ]);
  }

  equals(other) {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  get manhattan() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }
}

Vector.fromString = (coordinates) => new Vector(coordinates.split(',').map(Number));

class Particle {
  constructor({ id, position, velocity, acceleration }) {
    this.id = id;
    this.position = position;
    this.velocity = velocity;
    this.acceleration = acceleration;

    this.history = [this.manhattan];
    this.destroyed = false;
  }

  step() {
    this.velocity = this.velocity.add(this.acceleration);
    this.position = this.position.add(this.velocity);
    this.history.push(this.manhattan);
  }

  get manhattan() {
    return this.position.manhattan;
  }

  collidesWith(other) {
    return this.position.equals(other.position);
  }
}

Particle.fromString = (line, ix) => {
  const [, p] = line.match(/p=<([^>]*)>/);
  const [, v] = line.match(/v=<([^>]*)>/);
  const [, a] = line.match(/a=<([^>]*)>/);

  return new Particle({
    id: ix,
    position: Vector.fromString(p),
    velocity: Vector.fromString(v),
    acceleration: Vector.fromString(a)
  });
};

export class Question extends QuestionBase {
  constructor() {
    super(2017, 20, 170, 571);

    this.exampleInput({
      input: ['p=< 3,0,0>, v=< 2,0,0>, a=<-1,0,0>', 'p=< 4,0,0>, v=< 0,0,0>, a=<-2,0,0>'],
      part1: 0
    });
  }

  parseLine(line, ix) {
    return Particle.fromString(line, ix);
  }

  part1(input) {
    const sorted = input.sort((a, b) => {
      const { acceleration: aa, velocity: av, position: ap } = a;
      const { acceleration: ba, velocity: bv, position: bp } = b;

      return (aa.manhattan - ba.manhattan) || (av.manhattan - bv.manhattan) || (ap.manhattan - bp.manhattan);
    });

    const [{ id }] = sorted;
    return id;
  }

  part2(input) {
    let remaining = input.length;
    for (let i = 0; i < 1_000_000; i += 1) {
      const notDestroyed = input.filter(({ destroyed }) => !destroyed);
      notDestroyed.forEach((it) => it.step());
      notDestroyed.forEach((it) => it.destroyed = notDestroyed.some((other) => other.id !== it.id && it.collidesWith(other)));
      // This doesn't feel like a definitive terminating condition, but it works
      if (notDestroyed.length === remaining && remaining < 1000) return remaining;
      remaining = notDestroyed.length;
    }
  }
}
