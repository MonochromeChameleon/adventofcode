import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { CircularLinkedList } from '../../utils/linked-list.js';

export class Question extends QuestionBase {
  constructor() {
    super(2020, 23, 72496583);

    this.exampleInput({ input: '389125467', part1: 92658374 }, 10);
    this.exampleInput({ input: '389125467', part1: 67384529, part2: 149245887792 });
  }

  get parser() {
    return Parsers.SINGLE_LINE_DELIMITED_NUMBERS;
  }

  findDestination(current, list) {
    if (current < 1) return this.findDestination(10, list);
    if (list.values.includes(current - 1)) return current - 1;
    return this.findDestination(current - 1, list);
  }

  move(list) {
    const current = list.head.value;
    const nextThree = [list.head.next.pop(), list.head.next.pop(), list.head.next.pop()];
    const destination = this.findDestination(current, list);
    nextThree.reduce((n, v) => {
      n.insertAfter(v);
      return n.next;
    }, list.find(destination));
    list.moveTo(list.head.next.value);
  }

  part1(input, moves = 100) {
    const list = new CircularLinkedList(...input);
    for (let i = 0; i < moves; i++) {
      this.move(list);
    }

    list.moveTo(1);
    return Number(list.values.slice(1).join(''));
  }

  part2(input) {
    return input.reduce((a, b) => a + b, 0);
  }
}
