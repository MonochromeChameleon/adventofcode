import { QuestionBase } from '../../utils/question-base.js';

function quantumRoll(k, v, isP1) {
  const [p1, p2, s1, s2] = k.split(':').map(Number);

  if (isP1) {
    return {
      [`${(p1 + 3) % 10 || 10}:${p2}:${Math.min(s1 + ((p1 + 3) % 10 || 10), 21)}:${s2}`]: v,
      [`${(p1 + 4) % 10 || 10}:${p2}:${Math.min(s1 + ((p1 + 4) % 10 || 10), 21)}:${s2}`]: v * 3,
      [`${(p1 + 5) % 10 || 10}:${p2}:${Math.min(s1 + ((p1 + 5) % 10 || 10), 21)}:${s2}`]: v * 6,
      [`${(p1 + 6) % 10 || 10}:${p2}:${Math.min(s1 + ((p1 + 6) % 10 || 10), 21)}:${s2}`]: v * 7,
      [`${(p1 + 7) % 10 || 10}:${p2}:${Math.min(s1 + ((p1 + 7) % 10 || 10), 21)}:${s2}`]: v * 6,
      [`${(p1 + 8) % 10 || 10}:${p2}:${Math.min(s1 + ((p1 + 8) % 10 || 10), 21)}:${s2}`]: v * 3,
      [`${(p1 + 9) % 10 || 10}:${p2}:${Math.min(s1 + ((p1 + 9) % 10 || 10), 21)}:${s2}`]: v,
    };
  }
  return {
    [`${p1}:${(p2 + 3) % 10 || 10}:${s1}:${Math.min(s2 + ((p2 + 3) % 10 || 10), 21)}`]: v,
    [`${p1}:${(p2 + 4) % 10 || 10}:${s1}:${Math.min(s2 + ((p2 + 4) % 10 || 10), 21)}`]: v * 3,
    [`${p1}:${(p2 + 5) % 10 || 10}:${s1}:${Math.min(s2 + ((p2 + 5) % 10 || 10), 21)}`]: v * 6,
    [`${p1}:${(p2 + 6) % 10 || 10}:${s1}:${Math.min(s2 + ((p2 + 6) % 10 || 10), 21)}`]: v * 7,
    [`${p1}:${(p2 + 7) % 10 || 10}:${s1}:${Math.min(s2 + ((p2 + 7) % 10 || 10), 21)}`]: v * 6,
    [`${p1}:${(p2 + 8) % 10 || 10}:${s1}:${Math.min(s2 + ((p2 + 8) % 10 || 10), 21)}`]: v * 3,
    [`${p1}:${(p2 + 9) % 10 || 10}:${s1}:${Math.min(s2 + ((p2 + 9) % 10 || 10), 21)}`]: v,
  };
}

class Quantum {
  constructor(pPos1, pPos2) {
    this.state = { [`${pPos1}:${pPos2}:0:0`]: 1 };
    this.wins = [0, 0];
    this.isP1 = true;
  }

  get finished() {
    return Object.keys(this.state).every((k) => /21/.test(k));
  }

  step() {
    this.state = Object.keys(this.state).reduce((ste, k) => {
      const value = this.state[k];
      const change = quantumRoll(k, value, this.isP1);
      Object.keys(change).forEach((c) => {
        if (/21/.test(c)) {
          this.wins[this.isP1 ? 0 : 1] += change[c];
        } else {
          ste[c] = (ste[c] || 0) + change[c];
        }
      });
      return ste;
    }, {});
    this.isP1 = !this.isP1;
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2021, 21, 918081, 158631174219251);

    this.exampleInput({ filename: 'testinputs/21', part1: 739785, part2: 444356092776315 });
  }

  parseLine(line) {
    return Number(/(\d+)$/.exec(line)[1]);
  }

  parseInput(lines) {
    return lines.map(this.parseLine);
  }

  part1(positions) {
    let [pPos1, pPos2] = positions;
    let p1 = 0;
    let p2 = 0;
    let goes = 0;

    while (p1 < 1000 && p2 < 1000) {
      goes += 1;
      const delta = (17 - (goes % 10)) % 10 || 0;
      if (goes % 2) {
        pPos1 = (pPos1 + delta) % 10 || 10;
        p1 += pPos1;
      } else {
        pPos2 = (pPos2 + delta) % 10;
        p2 += pPos2;
      }
    }

    return Math.min(p1, p2) * goes * 3;
  }

  part2(input) {
    const quantum = new Quantum(...input);
    while (!quantum.finished) quantum.step();
    return Math.max(...quantum.wins);
  }
}
