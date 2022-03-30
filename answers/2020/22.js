import { QuestionBase, Parsers } from '../../utils/question-base.js';

class Game {
  constructor(player1, player2, recursive = false) {
    this.player1 = player1;
    this.player2 = player2;
    this.seen = new Set();
    this.recursive = recursive;
  }

  get winner() {
    if (this.player1.length === 0) return 'player2';
    if (this.player2.length === 0) return 'player1';
    return null;
  }

  play() {
    while (!this.winner) {
      const key = [this.player1.join(','), this.player2.join(',')].join('-');
      if (this.recursive && this.seen.has(key)) return { winner: 'player1', result: 'YAY' };
      this.seen.add(key);

      const p1 = this.player1.shift();
      const p2 = this.player2.shift();
      if (this.recursive && this.player1.length >= p1 && this.player2.length >= p2) {
        const { winner } = new Game(this.player1.slice(0, p1), this.player2.slice(0, p2), true).play();
        this[winner].push(...[p1, p2].sort(() => (winner === 'player1' ? 1 : -1)));
      } else {
        const [winner] = ['player1', 'player2'].sort(() => p1 - p2);
        this[winner].push(...[p1, p2].sort((a, b) => b - a));
      }
    }

    return this;
  }

  get result() {
    return [...this.player1, ...this.player2].reverse().reduce((sum, card, ix) => sum + (ix + 1) * card, 0);
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2020, 22, 31269, 31151);

    this.exampleInput({ part1: 306, part2: 291 });
    this.exampleInput({ part2: 'YAY' });
  }

  get parser() {
    return Parsers.GROUP;
  }

  get groupDelimiter() {
    return /Player/;
  }

  parseGroup(group) {
    return group.map(Number);
  }

  get mutates() {
    return true;
  }

  part1([player1, player2]) {
    return new Game(player1, player2).play().result;
  }

  part2([player1, player2]) {
    return new Game(player1, player2, true).play().result;
  }
}
