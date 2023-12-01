import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2017, 11, 818, 1596);

    this.exampleInput({ input: 'ne,ne,ne', part1: 3 });
    this.exampleInput({ input: 'ne,ne,sw,sw', part1: 0 });
    this.exampleInput({ input: 'ne,ne,s,s', part1: 2 });
    this.exampleInput({ input: 'se,sw,se,sw,sw', part1: 3 });
  }

  get parser() {
    return Parsers.SINGLE_LINE_SPLIT;
  }

  get split() {
    return ',';
  }

  getDelta({ n, ne, nw }) {
    const sne = ne ? ne / Math.abs(ne) : 0;
    const snw = nw ? nw / Math.abs(nw) : 0;
    const sn = n ? n / Math.abs(n) : 0;

    if (sne === snw) {
      return sne * Math.min(Math.abs(ne), Math.abs(nw));
    }
    if (sne === -sn) {
      return sne * Math.min(Math.abs(ne), Math.abs(n));
    }
    if (snw === -sn) {
      return snw * Math.min(Math.abs(nw), Math.abs(n));
    }

    return 0;
  }

  minimize({ n, ne, nw }) {
    const delta = this.getDelta({ n, ne, nw });
    return { n: n + delta, ne: ne - delta, nw: nw - delta };
  }

  invert(dir) {
    switch (dir) {
      case 's':
        return 'n';
      case 'se':
        return 'nw';
      case 'sw':
        return 'ne';
      default:
        return dir;
    }
  }

  path(input) {
    return input.reduce(
      ({ maxDistance: max, location: pos }, next) => {
        const prop = this.invert(next);
        const delta = next === prop ? 1 : -1;

        const { [prop]: p, ...rest } = pos;
        const location = this.minimize({ [prop]: p + delta, ...rest });

        const distance = Object.values(location).reduce((tot, d) => tot + Math.abs(d), 0);
        const maxDistance = Math.max(max, distance);

        return { distance, maxDistance, location };
      },
      { distance: 0, maxDistance: 0, location: { n: 0, ne: 0, nw: 0 } },
    );
  }

  part1(input) {
    const { distance } = this.path(input);
    return distance;
  }

  part2(input) {
    const { maxDistance } = this.path(input);
    return maxDistance;
  }
}
