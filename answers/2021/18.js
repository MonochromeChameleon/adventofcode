import { QuestionBase } from '../../utils/question-base.js';

function explode(input) {
  let stack = 0;
  let state = null;
  let explodeRight = null;

  const exploded = input.reduce((out, next) => {
    if (next === '[') stack += 1;
    if (next === ']') stack -= 1;

    if (stack === 4 && next === '[' && state === null) {
      state = 'exploding';
      return out;
    }
    if (stack === 3 && next === ']' && state === 'exploding') {
      out.push(0);
      return out;
    }

    if (state === 'exploded' || state === null) {
      out.push(next);
      return out;
    }

    if (next === ',' && explodeRight === null) {
      explodeRight = -1;
      return out;
    }

    if (explodeRight === null) {
      const lastDigitIndex = out.reduce((i, c, ix) => {
        if (Number.isInteger(Number(c))) return ix;
        return i;
      }, -1);

      if (lastDigitIndex >= 0) {
        out[lastDigitIndex] = Number(out[lastDigitIndex]) + Number(next);
      }
      return out;
    }

    if (explodeRight === -1) {
      explodeRight = Number(next);
      return out;
    }

    if (Number.isNaN(Number(next))) {
      out.push(next);
      return out;
    }

    out.push(Number(next) + explodeRight);
    state = 'exploded';
    return out;
  }, []);

  return [state === null ? 'split' : 'explode', exploded];
}

function split(input) {
  let hasSplit = false;
  const splitted = input.reduce((out, char) => {
    if (!Number.isInteger(char) || char <= 9 || hasSplit) {
      out.push(char);
    } else {
      hasSplit = true;
      out.push('[', Math.floor(char / 2), ',', Math.ceil(char / 2), ']');
    }
    return out;
  }, []);

  return [hasSplit ? 'explode' : 'done', splitted];
}

function reduce(input) {
  let next = 'explode';
  let characters = input.slice(0);

  while (next !== 'done') {
    switch (next) {
      case 'explode':
        [next, characters] = explode(characters);
        break;
      case 'split':
        [next, characters] = split(characters);
        break;
      case 'done':
        break;
    }
  }
  return characters;
}

class SnailfishNumber {
  constructor(str) {
    const characters = str.substr(1, str.length - 2).split('');
    const reducedCharacters = reduce(characters);

    let stack = 0;
    const split = {
      left: '',
      right: '',
    };

    let tgt = 'left';

    for (const next of reducedCharacters) {
      if (next === '[') stack += 1;
      if (next === ']') stack -= 1;

      if (stack === 0 && next === ',') {
        tgt = 'right';
      } else {
        split[tgt] += next;
      }
    }

    this.left = split.left.startsWith('[') ? new SnailfishNumber(split.left) : Number(split.left);
    this.right = split.right.startsWith('[') ? new SnailfishNumber(split.right) : Number(split.right);
  }

  toString() {
    return `[${this.left},${this.right}]`;
  }

  add(other) {
    return new SnailfishNumber(`[${this},${other}]`);
  }

  get magnitude() {
    const lMag = (typeof this.left === 'number' ? this.left : this.left.magnitude) * 3;
    const rMag = (typeof this.right === 'number' ? this.right : this.right.magnitude) * 2;
    return lMag + rMag;
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2021, 18, 2907, 4690);

    this.testInput('./testinputs/18.txt', 4140, 3993);
  }

  parseLine(line) {
    return new SnailfishNumber(line, 1);
  }

  parseInput(lines) {
    return lines.map(this.parseLine);
  }

  part1(input) {
    return input.reduce((sum, num) => sum.add(num)).magnitude;
  }

  part2(input) {
    return Math.max(...input.flatMap((num) => input.map((it) => (it === num ? 0 : num.add(it).magnitude))));
  }
}
