import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { CircularLinkedList } from '../../utils/linked-list.js';

export class Question extends QuestionBase {
  constructor() {
    super(2018, 9, 384892, 3169872331);

    this.exampleInput({ input: '9 players; last marble is worth 25 points', part1: 32 });
    this.exampleInput({ input: '10 players; last marble is worth 1618 points', part1: 8317 });
    this.exampleInput({ input: '13 players; last marble is worth 7999 points', part1: 146373 });
    this.exampleInput({ input: '17 players; last marble is worth 1104 points', part1: 2764 });
    this.exampleInput({ input: '21 players; last marble is worth 6111 points', part1: 54718 });
    this.exampleInput({ input: '30 players; last marble is worth 5807 points', part1: 37305 });
  }

  get parser() {
    return Parsers.SINGLE_STRING;
  }

  postParse(line) {
    const [, players, marbles] = line.match(/^(\d+) players; last marble is worth (\d+) points$/).map(Number);
    return { players, marbles };
  }

  play(players, marbles) {
    const circle = new CircularLinkedList(0);
    let node = circle.head;
    const scores = new Array(players).fill(0);
    for (let i = 1; i <= marbles; i += 1) {
      if (i % 23 === 0) {
        const player = i % players;
        node = node.prev.prev.prev.prev.prev.prev;
        scores[player] += i + node.prev.pop();
      } else {
        node = node.next;
        node.insertAfter(i);
        node = node.next;
      }
    }

    return scores.reduce((a, b) => Math.max(a, b));
  }

  part1({ players, marbles }) {
    return this.play(players, marbles);
  }

  part2({ players, marbles }) {
    return this.play(players, marbles * 100);
  }
}
