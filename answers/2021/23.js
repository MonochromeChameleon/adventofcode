import { QuestionBase } from '../../utils/question-base.js';
import { aStarSearch } from '../../utils/a-star.js';

export class Question extends QuestionBase {
  constructor() {
    super(2021, 23, 15338, 47064);

    this.exampleInput({ part1: 12521, part2: 44169 });
  }

  parseInput(lines) {
    return lines.join('').replace(/[# ]/g, '');
  }

  distance(from, to) {
    const toRoom = (to - 11) % 4;
    const toDepth = ~~((to - 11) / 4);

    if (from <= 10) {
      const betweenRooms = (from - 2) / 2;
      const distanceToRoom = 2 * Math.abs(toRoom - betweenRooms) + 1;
      return distanceToRoom + toDepth;
    }

    const fromRoom = (from - 11) % 4;
    const fromDepth = ~~((from - 11) / 4);
    const roomDiff = Math.abs(fromRoom - toRoom);
    return 2 + roomDiff * 2 + fromDepth + toDepth;
  }

  d(from, to) {
    const mismatches = [];
    for (let i = 0; i < from.length; i += 1) {
      if (from[i] !== to[i]) {
        mismatches.push(i);
      }
    }

    const mover = from[mismatches.find((i) => from[i] !== '.')];
    const energyCost = 10 ** ['A', 'B', 'C', 'D'].indexOf(mover);
    const distance = this.distance(...mismatches);

    return energyCost * distance;
  }

  h(state) {
    let score = 0;

    for (let i = 0; i < state.length; i += 1) {
      const char = 'ABCD'.indexOf(state[i]);
      if (i < 11 && char !== -1) {
        score += 10 ** char * this.distance(i, 11 + char);
      }
      if (i >= 11 && char !== -1) {
        const room = (i - 11) % 4;
        if (room !== char) {
          score += 10 ** char * this.distance(i, 11 + char);
        }
      }
    }

    return score;
  }

  canLand(from, to, state) {
    if (to <= 10) return true;
    const toRoom = (to - 11) % 4;
    const char = 'ABCD'[toRoom];
    if (state[from] !== char) return false;

    let i = 11 + toRoom;
    while (i <= to) {
      i += 4;
    }
    while (i < state.length) {
      if (state[i] !== char) return false;
      i += 4;
    }
    return true;
  }

  canLeave(from, to, state) {
    if (from <= 10) return true;
    const fromRoom = (from - 11) % 4;
    const char = 'ABCD'[fromRoom];

    let i = 11 + fromRoom;
    while (i < from) {
      if (state[i] !== '.') return false;
      i += 4;
    }
    while (i < state.length) {
      if (state[i] !== char) return true;
      i += 4;
    }
    return false;
  }

  canTransition(from, to, state) {
    const fromRoom = (from - 11) % 4;
    const toRoom = (to - 11) % 4;
    const h1 = from <= 10 ? from : fromRoom * 2 + 2;
    const h2 = to <= 10 ? to : toRoom * 2 + 2;

    const [hmin, hmax] = [h1, h2].sort((a, b) => a - b);
    const transitionPoints = [1, 3, 5, 7, 9].filter((i) => i > hmin && i < hmax);
    return transitionPoints.every((i) => state[i] === '.');
  }

  isValidMove(from, to, state) {
    return this.canLand(from, to, state) && this.canLeave(from, to, state) && this.canTransition(from, to, state);
  }

  moves(state) {
    const occupiedSpaces = Array.from({ length: state.length }, (_, i) => i).filter((i) => state[i] !== '.');

    const occupiedHall = [0, 1, 3, 5, 7, 9, 10].filter((i) => occupiedSpaces.includes(i));
    const unoccupiedHall = [0, 1, 3, 5, 7, 9, 10].filter((i) => !occupiedSpaces.includes(i));

    const occupiedRooms = Array.from({ length: state.length - 11 }, (_, i) => i + 11).filter((i) =>
      occupiedSpaces.includes(i)
    );
    const unoccupiedRooms = Array.from({ length: state.length - 11 }, (_, i) => i + 11).filter(
      (i) => !occupiedSpaces.includes(i)
    );

    const movesIntoRooms = occupiedHall.flatMap((from) => unoccupiedRooms.map((to) => ({
      from,
      to
    })));
    const movesIntoHall = occupiedRooms.flatMap((from) => unoccupiedHall.map((to) => ({
      from,
      to
    })));
    const movesBetweenRooms = occupiedRooms.flatMap((from) => unoccupiedRooms.map((to) => ({
      from,
      to
    })));

    const allMoves = [...movesIntoRooms, ...movesIntoHall, ...movesBetweenRooms].filter(({
        from,
        to
      }) =>
        this.isValidMove(from, to, state)
    );

    function swapStr(str, first, last) {
      return str.substr(0, first) + str[last] + str.substring(first + 1, last) + str[first] + str.substr(last + 1);
    }

    return allMoves.map(({ from, to }) => swapStr(state, ...[from, to].sort((a, b) => a - b)));
  }

  part1(input) {
    return aStarSearch({
      start: input,
      goal: '...........ABCDABCD',
      d: this.d.bind(this),
      h: this.h.bind(this),
      neighbours: this.moves.bind(this),
      searchSpaceSize: 0
    }).map(([start, ...steps]) => steps.reduce(({ state, score }, newState) => ({
      state: newState,
      score: score + this.d(state, newState)
    }), {
      state: start,
      score: 0
    })).map(({ score }) => score)
      .getOrThrow();
  }

  part2(input) {
    const startCondition = `${input.substr(0, 15)}DCBADBAC${input.substr(15)}`;

    return aStarSearch({
      start: startCondition,
      goal: '...........ABCDABCDABCDABCD',
      d: this.d.bind(this),
      h: this.h.bind(this),
      neighbours: this.moves.bind(this),
      searchSpaceSize: 0
    }).map(([start, ...steps]) => steps.reduce(({ state, score }, newState) => ({
      state: newState,
      score: score + this.d(state, newState)
    }), {
      state: start,
      score: 0
    })).map(({ score }) => score)
      .getOrThrow();
  }
}
