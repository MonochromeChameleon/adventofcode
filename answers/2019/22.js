import { QuestionBase } from '../../utils/question-base.js';
import { modularDivide, modularInverse } from '../../utils/modular-maths.js';

export class Question extends QuestionBase {
  constructor() {
    super(2019, 22, 3324, 74132511136410);
    this.wip = true;
    const params = [10, 9, 1];

    this.exampleInput(
      {
        input: ['deal with increment 7', 'deal into new stack', 'deal into new stack'],
        part1: 3,
        part2: 7,
      },
      ...params
    );
    this.exampleInput(
      {
        input: ['cut 6', 'deal with increment 7', 'deal into new stack'],
        part1: 8,
        part2: 6,
      },
      ...params
    );
    this.exampleInput(
      {
        input: ['deal with increment 7', 'deal with increment 9', 'cut -2'],
        part1: 9,
        part2: 9,
      },
      ...params
    );
    this.exampleInput(
      {
        input: [
          'deal into new stack',
          'cut -2',
          'deal with increment 7',
          'cut 8',
          'cut -4',
          'deal with increment 7',
          'cut 3',
          'deal with increment 9',
          'deal with increment 3',
          'cut -1',
        ],
        part1: 0,
        part2: 6,
      },
      ...params
    );
  }

  parseLine(line) {
    if (line === 'deal into new stack') {
      return { multiply: BigInt(-1), offset: BigInt(-1) };
    }
    if (line.startsWith('cut')) {
      return { multiply: BigInt(1), offset: -BigInt(line.substring(4)) };
    }

    return { multiply: BigInt(line.substring(20)), offset: BigInt(0) };
  }

  combine({ multiply: m1, offset: o1 }, { multiply: m2, offset: o2 }, deckSize) {
    let multiply = (m1 * m2) % deckSize;
    while (multiply < 0) multiply += deckSize;

    let offset = (o1 * m2 + o2) % deckSize;
    while (offset < 0) offset += deckSize;

    return { multiply, offset };
  }

  shuffle(targetIndex, deckSize, { multiply, offset }) {
    return (targetIndex * multiply + offset) % deckSize;
  }

  binarySomething(value) {
    if (value === 0) return [];
    const maxPow2 = 2 ** ~~Math.log2(value);
    return [maxPow2, ...this.binarySomething(value % maxPow2)];
  }

  repeat(shuffle, deckSize, repeats) {
    const multiShuffles = Array.from({ length: ~~Math.log2(repeats) }, (_, i) => 2 ** (i + 1)).reduce(
      (acc, ii) => {
        const s0 = acc[ii / 2];
        return { ...acc, [ii]: this.combine(s0, s0, deckSize) };
      },
      { 1: shuffle }
    );

    const shuffles = this.binarySomething(repeats);
    return shuffles.map((ii) => multiShuffles[ii]).reduceRight((acc, ii) => this.combine(acc, ii, deckSize));
  }

  part1(input, deckSize = 10007, targetCard = 2019) {
    const mod = BigInt(deckSize);
    const tgt = BigInt(targetCard);
    const singleShuffle = input.reduce((s1, s2) => this.combine(s1, s2, mod));
    return Number(this.shuffle(tgt, mod, singleShuffle));
  }

  part2(input, deckSize = 119315717514047, targetCard = 2020, repeats = 101741582076661) {
    const mod = BigInt(deckSize);
    const tgt = BigInt(targetCard);

    const singleShuffle = input.reduce((s1, s2) => this.combine(s1, s2, mod));
    const unSingleSuffle = {
      multiply: modularInverse(singleShuffle.multiply, mod),
      offset: mod - modularDivide(singleShuffle.offset, singleShuffle.multiply, mod),
    };

    const unshuffle = this.repeat(unSingleSuffle, mod, repeats);
    return Number(this.shuffle(tgt, mod, unshuffle));
  }
}
