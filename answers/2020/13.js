import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2020, 13, 222, 408270049879073);

    this.exampleInput({ input: ['939', '7,13,x,x,59,x,31,19'], part1: 295, part2: 1068781 });
    this.exampleInput({ input: ['17,x,13,19'], part2: 3417 });
    this.exampleInput({ input: ['67,7,59,61'], part2: 754018 });
    this.exampleInput({ input: ['67,x,7,59,61'], part2: 779210 });
    this.exampleInput({ input: ['67,7,x,59,61'], part2: 1261476 });
    this.exampleInput({ input: ['1789,37,47,1889'], part2: 1202161486 });
  }

  get parser() {
    return Parsers.MULTIPLE;
  }

  get parsers() {
    return {
      timestamp: Parsers.SINGLE_NUMBER,
      buses: Parsers.SINGLE_LINE_SPLIT_MAP,
    };
  }

  parserGroup(line) {
    return /,/.test(line) ? 'buses' : 'timestamp';
  }

  get split() {
    return ',';
  }

  parseValue(value) {
    return value === 'x' ? 'x' : Number(value);
  }

  part1({ timestamp, buses }) {
    const [first] = buses
      .filter((it) => it !== 'x')
      .map((bus) => {
        const wait = bus - (timestamp % bus);
        return { bus, wait };
      })
      .sort((a, b) => a.wait - b.wait);

    return first.bus * first.wait;
  }

  part2({ buses }) {
    return buses.reduce(
      ({ multiplier, timestamp }, bus, ix) => {
        if (bus === 'x') return { multiplier, timestamp };
        let t = timestamp;
        while (t % bus !== (bus * ix - ix) % bus) t += multiplier;
        return { multiplier: multiplier * bus, timestamp: t };
      },
      { multiplier: 1, timestamp: 0 },
    ).timestamp;
  }
}
