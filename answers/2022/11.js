import { QuestionBase, Parsers } from '../../utils/question-base.js';

class Monkey {
  constructor([idLine, itemsLine, opLine, testLine, ifTrueLine, ifFalseLine]) {
    this.id = Number(idLine.replace('Monkey ', '').replace(':', ''));
    this.inspections = 0;
    this.items = itemsLine.trim().replace('Starting items: ', '').split(',').map(Number);;
    this.originalItems = this.items.slice(0);
    this.divisor = Number(testLine.trim().replace('Test: divisible by ', ''));
    this.ifTrue = Number(ifTrueLine.trim().replace('If true: throw to monkey ', ''));
    this.ifFalse = Number(ifFalseLine.trim().replace('If false: throw to monkey ', ''));

    const [, op, val] = /Operation: new = old (.) (\d+|old)/.exec(opLine.trim());
    const value = Number(val);
    this.operation = (x) => {
      const v = (val === 'old' ? x : value);
      return op === '+' ? x + v : x * v;
    }
  }

  reset() {
    this.items = this.originalItems;
    this.inspections = 0;
  }

  inspect(jungle) {
    this.items.forEach((item) => {
      this.inspections += 1;
      const newValue = Math.floor(this.operation(item) / jungle.relief) % jungle.commonDivisor;
      jungle.monkeys[newValue % this.divisor ? this.ifFalse : this.ifTrue].items.push(newValue);
    });
    this.items = [];
  }
}

class Jungle {
  constructor(monkeys, relief) {
    this.monkeys = monkeys;
    this.relief = relief;
    this.commonDivisor = this.monkeys.map(({ divisor }) => divisor).reduce((a, b) => a * b, 1);
  }

  step(iterations) {
    Array.from({ length: iterations }).forEach(() => this.monkeys.forEach((m) => m.inspect(this)));
    return this;
  }

  get monkeyBusiness() {
    const [a, b] = this.monkeys.map(({ inspections }) => inspections).sort((a, b) => b - a);
    return a * b;
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2022, 11, 100345, 28537348205);

    this.exampleInput({ filename: '11a', part1: 10605, part2: 2713310158 });
  }

  get parser() {
    return Parsers.GROUP;
  }

  get groupSize() {
    return 6;
  }

  parseGroup(group) {
    return new Monkey(group);
  }

  reset(monkeys) {
    monkeys.forEach((m) => m.reset());
  }

  part1(monkeys) {
    return new Jungle(monkeys, 3).step(20).monkeyBusiness;
  }

  part2(monkeys) {
    return new Jungle(monkeys, 1).step(10000).monkeyBusiness;
  }
}
