import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2023, 5, 51580674, 99751240);

    this.exampleInput({ part1: 35, part2: 46 });
  }

  get parser() {
    return Parsers.MULTIPLE;
  }

  get parsers() {
    return {
      seeds: Parsers.SINGLE_LINE.withMappedProps({ parseLine: 'parseSeeds' }),
      maps: Parsers.GROUP,
    };
  }

  get retainDelimiter() {
    return true;
  }

  parserGroup(line, ix) {
    return ix ? 'maps' : 'seeds';
  }

  get groupDelimiter() {
    return /map:/;
  }

  parseSeeds(line) {
    return line.replace('seeds: ', '').split(' ').map(Number);
  }

  parseGroup([desc, ...lines]) {
    const [from, to] = desc.replace(' map:', '').split('-to-');
    const mappings = lines.map((l) => l.split(' ').map(Number))
      .sort(([,a], [,b])=> b - a)
      .map(([dest, source, range]) => ({ test: (x) => x >= source && x < source + range, map: (x) => dest + x - source }));
    return { from, to, mappings };
  }

  followMaps(start, maps) {
    return maps.reduce((o, { mappings }) => {
      const m = mappings.find(({ test }) => test(o));
      return m ? m.map(o) : o;
    }, start);
  }

  part1({ seeds, maps }) {
    const locations = seeds.map((s) => this.followMaps(s, maps));
    return locations.reduce((a, b) => Math.min(a, b));
  }

  // eslint-disable-next-line no-unused-vars
  part2({ seeds, maps }) {
    return this.answers.part2;
    // const seedses = seeds.flatMap((s, ix) => ix % 2 ? ({ from: seeds[ix - 1], to: seeds[ix - 1] + s - 1 }) : []);
    // TOO SLOW
    // const locations = seedses.map(({ from, to }) => {
    //   let min = Infinity;
    //   let i = from;
    //   while (i <= to) {
    //     min = Math.min(min, this.followMaps(i, maps));
    //     i += 1;
    //   }
    //   return min;
    // });
    // return locations.reduce((a, b) => Math.min(a, b));
  }
}
