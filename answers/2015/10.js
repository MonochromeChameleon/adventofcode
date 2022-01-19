import { QuestionBase, Parsers } from '../../utils/question-base.js';

class LookAndSay {
  constructor(line) {
    this.value = line;
    this.iterations = 0;
  }

  iterate(toValue) {
    while (this.iterations < toValue) {
      this.lookAndSay();
      this.iterations++;
    }
  }

  lookAndSay() {
    let count = 1;
    let out = '';
    for (let i = 0; i < this.value.length; i += 1) {
      if (this.value[i] === this.value[i + 1]) {
        count += 1;
      } else {
        out += count + this.value[i];
        count = 1;
      }
    }
    this.value = out;
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2015, 10, 329356, 4666278);
  }

  get parser() {
    return Parsers.SINGLE_LINE_CONSTRUCTOR;
  }

  get inputConstructor() {
    return LookAndSay;
  }

  part1(input) {
    input.iterate(40);
    return input.value.length;
  }

  part2(input) {
    input.iterate(50);
    return input.value.length;
  }
}
