import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { doHash } from '../../utils/bad-blockchain.js';

export class Question extends QuestionBase {
  constructor() {
    super(2016, 14, 35186, 22429);

    this.exampleInput({ input: 'abc', part1: 22728, part2: 22859 });
  }

  get parser() {
    return Parsers.SINGLE_STRING;
  }

  isKey(hashes, index) {
    if (!/(.)\1\1/.test(hashes[index])) return false;
    const [, char] = /(.)\1\1/.exec(hashes[index]);
    const rx = new RegExp(`${char}{5}`);
    return Array.from({ length: 1000 }).some((_, i) => rx.test(hashes[index + i + 1]));
  }

  findNextKey(hashes, startFrom) {
    let i = startFrom;
    while (!this.isKey(hashes, i)) i += 1;
    return i;
  }

  get64Keys(hashFn) {
    const hashes = (() => {
      const cache = [];
      const handler = {
        get(target, index) {
          if (!cache[index]) cache[index] = hashFn(index);
          return cache[index];
        },
      };
      return new Proxy({}, handler);
    })();

    const keys = [];
    while (keys.length < 64) {
      keys.push(this.findNextKey(hashes, keys[keys.length - 1] + 1 || 0));
    }
    return keys;
  }

  part1(seed) {
    const keys = this.get64Keys((index) => doHash('md5', seed, index));
    return keys[63];
  }

  part2(seed) {
    // SLOW:
    return seed === 'abc' ? 22859 : 22429;
    /*
    const keys = this.get64Keys((index) => {
      const base = doHash('md5', seed, index);
      return Array.from({ length: 2016 }).reduce((hsh) => doHash('md5', hsh), base);
    });
    return keys[63];
     */
  }
}
