import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2020, 18, 464478013511, 85660197232452);

    this.exampleInput({ input: '1 + 2 * 3 + 4 * 5 + 6', part1: 71, part2: 231 });
    this.exampleInput({ input: '1 + (2 * 3) + (4 * (5 + 6))', part1: 51 });
    this.exampleInput({ input: '2 * 3 + (4 * 5)', part1: 26, part2: 46 });
    this.exampleInput({ input: '5 + (8 * 3 + 9 + 3 * 4 * 3)', part1: 437, part2: 1445 });
    this.exampleInput({ input: '5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))', part1: 12240, part2: 669060 });
    this.exampleInput({ input: '((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2', part1: 13632, part2: 23340 });
  }

  parseLine(line) {
    const parseToken = (token) => {
      if (token.startsWith('(')) return ['(', ...parseToken(token.slice(1))];
      if (token.endsWith(')')) return [...parseToken(token.slice(0, -1)), ')'];
      if (Number.isNaN(Number(token))) return [token];
      return [Number(token)];
    };

    return line.split(' ').flatMap(parseToken);
  }

  evaluate(line) {
    const result = line.reduce(
      (state, next) => {
        if (next === '(') return { value: 0, operation: '+', stack: state };
        if (['+', '*'].includes(next)) return { ...state, operation: next };

        if (next === ')') {
          next = state.value;
          state = state.stack;
        }

        if (state.operation === '+') {
          state.value += next;
        } else {
          state.value *= next;
        }

        return state;
      },
      { value: 0, operation: '+' },
    );

    return result.value;
  }

  fixPrecedence(line) {
    return [
      '(',
      ...line.flatMap((t) => {
        if (t === '*') return [')', '*', '('];
        if (t === '(') return ['(', '('];
        if (t === ')') return [')', ')'];
        return t;
      }),
      ')',
    ];
  }

  part1(input) {
    return input.reduce((sum, line) => sum + this.evaluate(line), 0);
  }

  part2(input) {
    return input.map((line) => this.fixPrecedence(line)).reduce((sum, line) => sum + this.evaluate(line), 0);
  }
}
