import { QuestionBase, Parsers } from '../../utils/question-base.js';

const A = 'a'.charCodeAt(0);
const I = 'i'.charCodeAt(0);
const O = 'o'.charCodeAt(0);
const L = 'l'.charCodeAt(0);
const Z = 'z'.charCodeAt(0);

export class Question extends QuestionBase {
  constructor() {
    super(2015, 11, 'hepxxyzz', 'heqaabcc');

    this.exampleInput({ input: 'abcdefgh', part1: 'abcdffaa' });
    this.exampleInput({ input: 'ghijklmn', part1: 'ghjaabcc' });
  }

  get parser() {
    return Parsers.SINGLE_LINE_SPLIT_MAP;
  }

  get map() {
    return (char) => char.charCodeAt(0);
  }

  iteratePassword(charCodes) {
    const head = charCodes.slice(0, charCodes.length - 1);
    const last = charCodes[charCodes.length - 1];
    const next = [I, O, L].includes(last + 1) ? last + 2 : last + 1;

    const iterated = last === Z ? this.iteratePassword(head).concat(A) : head.concat(next);

    // Handle forbidden characters immediately rather than iterating them out.
    return iterated.reduce(
      ({ out, aaaa }, c) => {
        if (aaaa) return { out: [...out, A], aaaa };
        if (![I, O, L].includes(c)) return { out: [...out, c], aaaa };
        return { out: [...out, c + 1], aaaa: true };
      },
      { out: [], aaaa: false }
    ).out;
  }

  hasThreeConsecutive(charCodes) {
    return charCodes.find((c, i) => c === charCodes[i + 1] - 1 && c === charCodes[i + 2] - 2);
  }

  hasTwoPairs(charCodes) {
    return (
      charCodes
        .map((c, i) => (c === charCodes[i + 1] ? i : false))
        .filter((it) => it !== false)
        .reduce((out, next) => {
          if (out[out.length - 1] === next - 1) return out;
          return [...out, next];
        }, []).length > 1
    );
  }

  isValid(charCodes) {
    return this.hasThreeConsecutive(charCodes) && this.hasTwoPairs(charCodes);
  }

  part1(input) {
    let pw = this.iteratePassword(input);
    while (!this.isValid(pw)) pw = this.iteratePassword(pw);
    return pw.map((c) => String.fromCharCode(c)).join('');
  }

  part2() {
    const newInput = this.parseInput([this.answers.part1]);
    let pw = this.iteratePassword(newInput);
    while (!this.isValid(pw)) pw = this.iteratePassword(pw);
    return pw.map((c) => String.fromCharCode(c)).join('');
  }
}
