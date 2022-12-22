import { QuestionBase } from '../../utils/question-base.js';

function calculate(first, second, op) {
  switch (op) {
    case '+':
      return first + second;
    case '-':
      return first - second;
    case '*':
      return first * second;
    case '/':
      return first / second;
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2022, 21, 80326079210554, 3617613952378);

    this.exampleInput({ filename: '21a', part1: 152, part2: 301 });
  }

  parseLine(line) {
    const [id, rest] = line.split(':').map((it) => it.trim());
    const value = Number(rest);
    const isValue = /\d+/.test(rest);
    const [first, op, second] = isValue ? [] : rest.split(' ');

    return { id, value, isValue, first, second, op };
  }

  postParse(lines) {
    return Object.fromEntries(lines.map(({ id, ...rest }) => [id, rest]));
  }

  part1(input) {
    const p = new Proxy(input, {
      get(target, key) {
        if (target[key].isValue) return target[key].value;
        const { first: f, second: s, op } = target[key];
        return calculate(p[f], p[s], op);
      }
    });
    return p.root;
  }

  solve(equation, value) {
    if (equation === 'humn') return value;
    const { first, second, op } = equation;

    switch (op) {
      case '+':
        return Number.isInteger(first) ? this.solve(second, value - first) : this.solve(first, value - second);
      case '-':
        return Number.isInteger(first) ? this.solve(second, first - value) : this.solve(first, value + second);
      case '*':
        return Number.isInteger(first) ? this.solve(second, value / first) : this.solve(first, value / second);
      case '/':
        return Number.isInteger(first) ? this.solve(second, first / value) : this.solve(first, value * second);
    }
  }

  part2(input) {
    const { first: fRoot, second: sRoot } = input.root;

    const p = new Proxy(input, {
      get(target, key) {
        if (target[key].isValue) return target[key].value;
        const { first: f, second: s, op } = target[key];
        const first = p[f];
        const second = p[s];

        if (f === 'humn' || s === 'humn' || first.isHuman || second.isHuman) {
          const ff = first.isHuman ? first.value : (f === 'humn' ? f : first);
          const ss = second.isHuman ? second.value : (s === 'humn' ? s : second);
          return { value: { first: ff, second: ss, op }, isHuman: true };
        }

        return calculate(first, second, op);
      }
    });

    return this.solve(p[fRoot].value, p[sRoot]);
  }
}
