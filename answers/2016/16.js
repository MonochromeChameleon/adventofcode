import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2016, 16, '10100101010101101', '01100001101101001');

    this.exampleInput({ input: '10000', part1: '01100' }, 20);
  }

  get parser() {
    return Parsers.SINGLE_STRING;
  }

  dragon(data, diskSize) {
    const iterations = Math.ceil(Math.log2((diskSize + 1) / (data.length + 1)));
    return Array.from({ length: iterations }).reduce(
      (sofar) => [...sofar, 0, ...sofar.reverse().map((it) => it ^ 1)],
      data
    );
  }

  squish(window) {
    return Array.from({ length: Math.log2(window.length) }).reduce(
      (out) => out.slice(0, out.length / 2).map((_, i) => (out[i * 2] === out[i * 2 + 1] ? 1 : 0)),
      window
    );
  }

  checksum(data) {
    const squish = Array.from({ length: Math.floor(Math.log2(data.length)) }).findIndex(
      (_, i) => !Number.isInteger(data.length / 2 ** (i + 1))
    );
    const outSize = data.length / 2 ** squish;
    const windows = Array.from({ length: outSize }).map((_, i) => data.slice(i * 2 ** squish, (i + 1) * 2 ** squish));
    return windows.map(this.squish).join('');
  }

  part1(input, diskSize = 272) {
    const data = this.dragon(input.split('').map(Number), diskSize);
    return this.checksum(data.slice(0, diskSize));
  }

  part2(input) {
    return this.part1(input, 35651584);
  }
}
