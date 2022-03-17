import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { Vector } from '../../utils/vector.js';

class Moon {
  constructor(position, velocity = new Vector(0, 0, 0)) {
    this.position = position;
    this.velocity = velocity;
  }

  applyGravity(moon) {
    return moon.position.subtract(this.position).map(Math.sign);
  }

  applyVelocity(velocity) {
    const newVelocity = this.velocity.add(velocity);
    const newPosition = this.position.add(newVelocity);

    return new Moon(newPosition, newVelocity);
  }

  calculateVelocity(moons) {
    return moons.reduce((v, m) => v.add(this.applyGravity(m)), new Vector(0, 0, 0));
  }

  get energy() {
    return this.velocity.manhattan * this.position.manhattan;
  }

  equals(other, axis) {
    return this.position[axis] === other.position[axis] && this.velocity[axis] === other.velocity[axis];
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2019, 12, 14809, 282270365571288);

    this.exampleInput({ part1: 179, part2: 2772 }, 10);
    this.exampleInput({ part1: 1940, part2: 4686774924 }, 100);
  }

  get parser() {
    return Parsers.MULTI_LINE_DELIMITED_INTEGERS_WITH_CRUFT;
  }

  get split() {
    return ',';
  }

  postParse(lines) {
    return lines.map((l) => new Moon(new Vector(...l)));
  }

  step(ms) {
    const velocities = ms.map((moon) => moon.calculateVelocity(ms));
    return ms.map((moon, i) => moon.applyVelocity(velocities[i]));
  }

  lcm(a, b) {
    const min = Math.min(a, b);
    const max = Math.max(a, b);

    let out = max;
    while (out % min !== 0) out += max;

    return out;
  }

  part1(input, steps = 1000) {
    const endState = Array.from({ length: steps }).reduce(this.step, input);
    return endState.reduce((sofar, moon) => sofar + moon.energy, 0);
  }

  part2(input) {
    const findEndState = (moons, axis) => {
      let out = this.step(moons);
      let i = 1;
      while (!out.every((m, ix) => moons[ix].equals(m, axis))) {
        out = this.step(out);
        i += 1;
      }
      return i;
    };

    const x = findEndState(input, 'x');
    const y = findEndState(input, 'y');
    const z = findEndState(input, 'z');

    const lcmxy = this.lcm(x, y);
    return this.lcm(lcmxy, z);
  }
}
