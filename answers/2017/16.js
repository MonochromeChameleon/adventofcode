import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { alphabet } from '../../utils/alphabet.js';

export class Question extends QuestionBase {
  constructor() {
    super(2017, 16, 'kgdchlfniambejop', 'fjpmholcibdgeakn');

    this.exampleInput({ input: 's1,x3/4,pe/b', part1: 'baedc', part2: 'ceadb' }, 5, 2);
  }

  get parser() {
    return Parsers.DAISY_CHAIN;
  }

  get parsers() {
    return {
      split: Parsers.SINGLE_LINE_SPLIT,
      instructions: Parsers.INSTRUCTIONS,
    };
  }

  get split() {
    return ',';
  }

  parseInstruction(instruction) {
    switch (instruction[0]) {
      case 's':
        return 'spin';
      case 'x':
        return 'exchange';
      case 'p':
        return 'partner';
    }
  }

  parseParams(instruction) {
    return instruction
      .slice(1)
      .split('/')
      .map((it) => (Number.isNaN(Number(it)) ? it : Number(it)))
      .sort((a, b) => a - b);
  }

  spin(amount) {
    this.state = this.state.slice(-amount).concat(this.state.slice(0, -amount));
  }

  exchange(first, second) {
    this.state = this.state
      .slice(0, first)
      .concat(this.state[second])
      .concat(this.state.slice(first + 1, second))
      .concat(this.state[first])
      .concat(this.state.slice(second + 1));
  }

  partner(first, second) {
    const [f, s] = [this.state.indexOf(first), this.state.indexOf(second)].sort((a, b) => a - b);
    this.state = this.state
      .slice(0, f)
      .concat(this.state[s])
      .concat(this.state.slice(f + 1, s))
      .concat(this.state[f])
      .concat(this.state.slice(s + 1));
  }

  part1(steps, length = 16) {
    const state = alphabet(length);
    const { state: final } = this.execute(steps, { state }, {}, length);
    return final.join('');
  }

  part2(steps, length = 16, repeats = 1_000_000_000) {
    const seen = [];
    let out = alphabet(length);
    while (out.join('') !== seen[0] && seen.length < repeats) {
      seen.push(out.join(''));
      out = this.execute(steps, { state: out }).state;
    }
    if (seen.length === repeats) {
      return out.join('');
    }
    return seen[repeats % seen.length];
  }
}
