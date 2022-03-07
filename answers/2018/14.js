import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { CircularLinkedList } from '../../utils/linked-list.js';
import { FixedLengthList } from '../../utils/fixed-length-list.js';

class Elf {
  constructor(node) {
    this.node = node;
  }

  get value() {
    return this.node.value;
  }

  move() {
    const value = this.node.value;
    for (let i = 0; i <= value; i += 1) {
      this.node = this.node.next;
    }
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2018, 14, '4138145721', 20276284);

    this.exampleInput({ input: 9, part1: '5158916779' });
    this.exampleInput({ input: 5, part1: '0124515891' });
    this.exampleInput({ input: 18, part1: '9251071085' });
    this.exampleInput({ input: 2018, part1: '5941429882' });

    this.exampleInput({ input: '51589', part2: 9 });
    this.exampleInput({ input: '01245', part2: 5 });
    this.exampleInput({ input: '92510', part2: 18 });
    this.exampleInput({ input: '59414', part2: 2018 });
  }

  get parser() {
    return Parsers.SINGLE_STRING;
  }

  makeRecipes(elves, recipes) {
    const score = elves.map((elf) => elf.value).reduce((a, b) => a + b);
    const digits = score.toString().split('').map(Number);
    recipes.add(...digits);

    elves.forEach((elf) => elf.move());
    return digits;
  }

  foundTarget(target, recipes) {
    let node = recipes.tail;

    for (let i = 0; i < target.length; i += 1) {
      if (node.value !== target[i]) {
        return false;
      }
      node = node.prev;
    }
    return true;
  }

  part1(input) {
    const inputValue = Number(input);
    const recipes = new CircularLinkedList(3, 7);
    const elves = [new Elf(recipes.head), new Elf(recipes.tail)];

    while (recipes.length < inputValue + 10) this.makeRecipes(elves, recipes);

    for (let i = 0; i < inputValue; i += 1) {
      recipes.shift();
    }

    return recipes.values.slice(0, 10).join('');
  }

  part2(input) {
    const recipes = new CircularLinkedList(3, 7);
    const elves = [new Elf(recipes.head), new Elf(recipes.tail)];

    const target = input.split('').map(Number);
    const window = new FixedLengthList(target.length);
    let foundTarget = false;

    while (!foundTarget) {
      const digits = this.makeRecipes(elves, recipes);
      foundTarget = digits.reduce((ft, digit) => {
        if (ft) {
          return 1;
        }
        window.add(digit);
        return window.equals(target);
      }, foundTarget);
    }

    const offset = foundTarget === 1 ? 1 : 0;

    return recipes.length - target.length - offset;
  }
}
