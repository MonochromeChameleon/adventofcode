import { QuestionBase, Parsers } from '../../utils/question-base.js';

class Orbit {
  constructor(def) {
    const [, c, s] = /(\w+)\)(\w+)/.exec(def);
    this.centre = c;
    this.satellite = s;
  }
}

class Orbiter {
  constructor(name, depth, orbits) {
    this.name = name;
    this.depth = depth;
    this.satellites = orbits
      .filter((it) => it.centre === name)
      .map((orbit) => new Orbiter(orbit.satellite, depth + 1, orbits));
  }

  get directAndIndirectOrbits() {
    return this.depth + this.satellites.reduce((sofar, s) => sofar + s.directAndIndirectOrbits, 0);
  }

  has(name) {
    return this.satellites.some((it) => it.name === name || it.has(name));
  }

  traverseWhile(predicate) {
    const traverse = this.satellites.some((it) => predicate(it));
    if (!traverse) return this;

    return this.satellites.find((it) => predicate(it)).traverseWhile(predicate);
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2019, 6, 254447, 445);

    this.exampleInput({ part1: 42 });
    this.exampleInput({ part2: 4 });
  }

  get parser() {
    return Parsers.MULTI_LINE_CONSTRUCTOR;
  }

  get inputConstructor() {
    return Orbit;
  }

  postParse(orbits) {
    return new Orbiter('COM', 0, orbits);
  }

  part1(COM) {
    return COM.directAndIndirectOrbits;
  }

  part2(COM) {
    const sharedRoot = COM.traverseWhile((it) => it.has('YOU') && it.has('SAN'));
    const SAN = COM.traverseWhile((it) => it.has('SAN'));
    const YOU = COM.traverseWhile((it) => it.has('YOU'));

    return YOU.depth - sharedRoot.depth + (SAN.depth - sharedRoot.depth);
  }
}
