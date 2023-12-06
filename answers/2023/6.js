import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2023, 6, 128700, 39594072);

    this.exampleInput({ part1: 288, part2: 71503 })
  }

  parseInput([t, d]) {
     const times = t.replace(/[a-zA-Z:]/g, '').split(' ').filter(Boolean).map(Number);
     const distances = d.replace(/[a-zA-Z:]/g, '').split(' ').filter(Boolean).map(Number);

     const races = times.map((time, ix) => ({ time, distance: distances[ix] }));
     const oneRace = { time: Number(t.replace(/\D/g ,'')), distance: Number(d.replace(/\D/g, '')) };
     return { races, oneRace }
  }

  countWins({ time, distance }) {
    let t = 1;
    while (t * (time - t) <= distance) t += 1;
    return (time + 1) - (2 * t);
  }

  part1({ races }) {
    return races.map((r) => this.countWins(r)).reduce((a, b) => a * b);
  }

  part2({ oneRace }) {
    return this.countWins(oneRace);
  }
}
