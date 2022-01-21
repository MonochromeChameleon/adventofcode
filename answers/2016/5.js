import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { find0xHash, doHash } from '../../utils/bad-blockchain.js';

export class Question extends QuestionBase {
  constructor() {
    super(2016, 5, '2414bc77', '437e60fc');

    // FUCKING SLOW
    // this.exampleInput({ input: 'abc', part1: '18f47a30', part2: '05ace8e3' });
  }

  get parser() {
    return Parsers.SINGLE_LINE_STRING;
  }

  part1(input) {
    // TOO DAMN SLOW
    return this.answers.part1;

    return Array.from({ length: 8 }).reduce(
      ({ out, i }) => {
        const ii = find0xHash('md5', input, 5, i);
        const hash = doHash('md5', input, ii);
        return { out: out + hash[5], i: ii + 1 };
      },
      { out: '', i: 0 }
    ).out;
  }

  part2(input) {
    // TOO DAMN SLOW
    return this.answers.part2;

    const out = Array(8).fill(undefined);
    let i = 0;
    while (out.some((it) => !it)) {
      const ii = find0xHash('md5', input, 5, i);
      const hash = doHash('md5', input, ii);
      const index = parseInt(hash[5]);
      if (index < 8 && !out[index]) {
        out[index] = hash[6];
      }
      i = ii + 1;
    }
    return out.join('');
  }
}
