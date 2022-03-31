import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { BigCircularLinkedList } from '../../utils/linked-list.js';

export class Question extends QuestionBase {
  constructor() {
    super(2020, 23, 72496583, 41785843847);

    this.exampleInput({ input: '389125467', part1: 92658374 }, 10);
    this.exampleInput({ input: '389125467', part1: 67384529, part2: 149245887792 });
  }

  get parser() {
    return Parsers.SINGLE_LINE_DELIMITED_NUMBERS;
  }

  findDestination(dest, nextThree, max) {
    if (nextThree.includes(dest)) return this.findDestination(dest - 1, nextThree, max);
    if (dest === 0) return this.findDestination(max, nextThree, max);
    return dest;
  }

  move(list, max) {
    const current = list.head.value;
    const nextThree = [list.head.next.pop(), list.head.next.pop(), list.head.next.pop()];
    const destination = this.findDestination(current - 1, nextThree, max);
    nextThree.reduce((n, v) => {
      n.insertAfter(v);
      return n.next;
    }, list.find(destination));
    list.moveTo(list.head.next.value);
  }

  execute(input, max, moves) {
    const inp = Array.from({ length: max }, (_, i) => input[i] || i + 1);
    const list = new BigCircularLinkedList(inp);
    const lookup = new Array(max + 1);
    list.forEach((n) => {
      lookup[n.value] = n;
    });

    let current = list.head;

    for (let i = 0; i < moves; i += 1) {
      const nextThree = [current.next.pop(), current.next.pop(), current.next.pop()];
      const destination = this.findDestination(current.value - 1, nextThree, max);
      nextThree
        .map((n) => lookup[n])
        .reduce((p, n) => {
          p.insertAfter(n);
          return n;
        }, lookup[destination]);
      current = current.next;
    }

    list.head = lookup[1];
    return list;
  }

  part1(input, moves = 100) {
    const list = this.execute(input, 9, moves);
    return Number(list.values.slice(1).join(''));
  }

  part2(input, moves = 10_000_000) {
    const list = this.execute(input, 1_000_000, moves);
    return list.head.next.pop() * list.head.next.pop();
  }
}
