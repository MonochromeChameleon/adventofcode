import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2023, 2, 2204, 71036);

    this.exampleInput({ part1: 8, part2: 2286 });
  }

  parseLine(line) {
    const [gameId, hands] = line.split(':');
    const id = Number(gameId.replace('Game ', ''));
    const rounds = hands.split(';').map((it) =>
      Object.fromEntries(
        it
          .trim()
          .split(',')
          .map((c) => {
            const [num, colour] = c.trim().split(' ');
            return [colour, Number(num)];
          }),
      ),
    );
    return { id, rounds };
  }

  isPossible(rounds, { red, green, blue }) {
    return rounds.every(({ red: r = 0, green: g = 0, blue: b = 0 }) => r <= red && g <= green && b <= blue);
  }

  minCubes(rounds) {
    return rounds.reduce(({ red = 0, green = 0, blue = 0 }, { red: r = 0, green: g = 0, blue: b = 0 }) => ({
      red: Math.max(red, r),
      green: Math.max(green, g),
      blue: Math.max(blue, b),
    }));
  }

  part1(input, { red = 12, green = 13, blue = 14 } = {}) {
    return input
      .filter(({ rounds }) => this.isPossible(rounds, { red, green, blue }))
      .reduce((sum, { id }) => sum + id, 0);
  }

  part2(input) {
    return input
      .map(({ rounds }) => this.minCubes(rounds))
      .map(({ red, green, blue }) => red * green * blue)
      .reduce((a, b) => a + b);
  }
}
