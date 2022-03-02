import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { knotHash, knotHashRound } from './knot-hash/knot-hash.js';

export class Question extends QuestionBase {
  constructor() {
    super(2017, 10, 40132, '35b028fe2c958793f7d5a61d07a008c8');

    this.exampleInput({ input: '3, 4, 1, 5', part1: 12 }, 5);

    this.exampleInput({ input: '', part2: 'a2582a3a0e66e6e86e3812dcb672a272' });
    this.exampleInput({ input: 'AoC 2017', part2: '33efeb34ea91902bb2f59c9920caa6cd' });
    this.exampleInput({ input: '1,2,3', part2: '3efbe78a8d82f29979031a4aa0b16a9d' });
    this.exampleInput({ input: '1,2,4', part2: '63960835bcdc130f0b66d7ff4f6a5a8e' });
  }

  get parser() {
    return Parsers.SINGLE_STRING;
  }

  get split() {
    return ',';
  }

  part1(rawInput, size = 256) {
    const lengths = Parsers.SINGLE_LINE_DELIMITED_NUMBERS
      .withMappedProps({ parseLine: 'splitNumbers' })
      .mixin(this)
      .splitNumbers
      .call(this, rawInput);

    const {
      crypt: [a, b],
    } = knotHashRound(
      Array.from({ length: size }, (_, i) => i),
      lengths
    );
    return a * b;
  }

  part2(input, size = 256) {
    return knotHash(input, size);
  }
}
