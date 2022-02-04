import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2016, 21, 'hcdefbag', 'fbhaegdc');

    this.exampleInput({ filename: '21a', part1: 'decab' }, 'abcde');
    this.exampleInput({ filename: '21', part2: 'abcdefgh' }, 'hcdefbag');
  }

  get parser() {
    return Parsers.MULTI_LINE_MAP;
  }

  map(line) {
    if (line.startsWith('swap position')) {
      const [, ...positions] = line.match(/swap position (\d+) with position (\d+)/);
      const [first, second] = positions.map(Number).sort();
      return { type: 'swapPosition', first, second };
    }
    if (line.startsWith('swap letter')) {
      const [, first, second] = line.match(/swap letter (\w) with letter (\w)/);
      return { type: 'swapLetter', first, second };
    }
    if (line.startsWith('rotate based')) {
      const [, first] = line.match(/rotate based on position of letter (\w)/);
      return { type: 'rotateBased', first };
    }
    if (line.startsWith('rotate')) {
      const [, direction, steps] = line.match(/rotate (left|right) (\d+) step/);
      return { type: 'rotate', direction: direction === 'left', steps: Number(steps) };
    }
    if (line.startsWith('reverse')) {
      const [, ...positions] = line.match(/reverse positions (\d+) through (\d+)/);
      const [first, second] = positions.map(Number);
      return { type: 'reverse', first, second };
    }
    if (line.startsWith('move')) {
      const [, ...positions] = line.match(/move position (\d+) to position (\d+)/);
      const [first, second] = positions.map(Number);
      return { type: 'move', first, second };
    }
  }

  swapPosition({ first, second }) {
    return (
      this.substr(0, first) +
      this.substr(second, 1) +
      this.substr(first + 1, second - first - 1) +
      this.substr(first, 1) +
      this.substr(second + 1)
    );
  }

  swapLetter({ first, second }) {
    const [fix, six] = [this.indexOf(first), this.indexOf(second)].sort();
    return this.substr(0, fix) + this[six] + this.substr(fix + 1, six - fix - 1) + this[fix] + this.substr(six + 1);
  }

  rotate({ direction, steps }, reverse = false) {
    if (!steps) return this;

    if (direction ^ reverse) {
      return this.substr(steps) + this.substr(0, steps);
    }
    return this.substr(-steps) + this.substr(0, this.length - steps);
  }

  rotateBased({ first }, reverse = false) {
    const index = this.indexOf(first);
    if (reverse) {
      const steps = index % 2 === 1 ? (index + 1) / 2 : (6 + ((8 + (index - 2)) % 8) / 2) % 8;
      if (!steps) return this;
      return this.substr(steps) + this.substr(0, steps);
    }

    const steps = (index + (index >= 4 ? 2 : 1)) % this.length;
    if (!steps) return this;
    return this.substr(-steps) + this.substr(0, this.length - steps);
  }

  reverse({ first, second }) {
    return (
      this.substr(0, first) +
      this.substr(first, second - first + 1)
        .split('')
        .reverse()
        .join('') +
      this.substr(second + 1)
    );
  }

  move({ first, second }, reverse = false) {
    const from = reverse ? second : first;
    const to = reverse ? first : second;
    const moved = this.substr(from, 1);
    const remainder = this.substr(0, from) + this.substr(from + 1);
    return remainder.substr(0, to) + moved + remainder.substr(to);
  }

  part1(instructions, input = 'abcdefgh') {
    return instructions.reduce((sofar, { type, ...args }) => this[type].call(sofar, args), input);
  }

  part2(instructions, input = 'fbgdceah') {
    return instructions.reverse().reduce((sofar, { type, ...args }) => this[type].call(sofar, args, true), input);
  }
}
