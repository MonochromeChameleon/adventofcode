import { QuestionBase, Parsers } from '../../utils/question-base.js';

class Sue {
  constructor(line) {
    const [, number, properties] = line.match(/Sue (\d+): (.*)/);
    this.number = Number(number);
    const { children, cats, samoyeds, pomeranians, akitas, vizslas, goldfish, trees, cars, perfumes } =
      Object.fromEntries(
        properties
          .split(', ')
          .map((prop) => prop.split(':'))
          .map(([key, value]) => [key, Number(value)])
      );

    this.children = children;
    this.cats = cats;
    this.samoyeds = samoyeds;
    this.pomeranians = pomeranians;
    this.akitas = akitas;
    this.vizslas = vizslas;
    this.goldfish = goldfish;
    this.trees = trees;
    this.cars = cars;
    this.perfumes = perfumes;
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2015, 16, 213, 323);

    this.tickerTape = {
      children: 3,
      cats: 7,
      samoyeds: 2,
      pomeranians: 3,
      akitas: 0,
      vizslas: 0,
      goldfish: 5,
      trees: 3,
      cars: 2,
      perfumes: 1,
    };
  }

  get parser() {
    return Parsers.MULTI_LINE_CONSTRUCTOR;
  }

  get inputConstructor() {
    return Sue;
  }

  part1(sues) {
    return sues.find((sue) => {
      return Object.entries(this.tickerTape).every(([key, value]) => {
        return sue[key] === value || sue[key] === undefined;
      });
    }).number;
  }

  part2(sues) {
    return sues.find((sue) => {
      return Object.entries(this.tickerTape).every(([key, value]) => {
        if (sue[key] === undefined) return true;
        if (key === 'cats' || key === 'trees') {
          return sue[key] > value;
        }
        if (key === 'pomeranians' || key === 'goldfish') {
          return sue[key] < value;
        }

        return sue[key] === value;
      });
    }).number;
  }
}
