import { QuestionBase } from '../utils/question-base.js';
import { aStarSearch } from '../utils/a-star.js';

export class Question extends QuestionBase {
  constructor (args) {
    super(23, 12521, 15338, undefined, undefined, args);
  }

  parseInput(lines) {
    return lines.join('').replace(/[# ]/g, '');
  }

  distance(from, to) {
    if (from === 0 || from === 1) {
      const slot = (to - 11) % 4;
      const depth = ~~((to - 11) / 4);
      return 3 + depth + (slot * 2) - from;
      // if (to === 11) return 3 - from;
      // if (to === 15) return 4 - from;
      // if (to === 12) return 5 - from;
      // if (to === 16) return 6 - from;
      // if (to === 13) return 7 - from;
      // if (to === 17) return 8 - from;
      // if (to === 14) return 9 - from;
      // if (to === 18) return 10 - from;
    }
    if (from === 3) {
      if (to === 11) return 2;
      if (to === 12) return 2;
      if (to === 13) return 4;
      if (to === 14) return 6;
      if (to === 15) return 3;
      if (to === 16) return 3;
      if (to === 17) return 5;
      if (to === 18) return 7;
    }
    if (from === 5) {
      if (to === 11) return 4;
      if (to === 12) return 2;
      if (to === 13) return 2;
      if (to === 14) return 4;
      if (to === 15) return 5;
      if (to === 16) return 3;
      if (to === 17) return 3;
      if (to === 18) return 5;
    }
    if (from === 7) {
      if (to === 11) return 6;
      if (to === 12) return 4;
      if (to === 13) return 2;
      if (to === 14) return 2;
      if (to === 15) return 7;
      if (to === 16) return 5;
      if (to === 17) return 3;
      if (to === 18) return 3;
    }
    if (from === 9 || from === 10) {
      if (to === 11) return 8 + from - 9;
      if (to === 12) return 6 + from - 9;
      if (to === 13) return 4 + from - 9;
      if (to === 14) return 2 + from - 9;
      if (to === 15) return 9 + from - 9;
      if (to === 16) return 7 + from - 9;
      if (to === 17) return 5 + from - 9;
      if (to === 18) return 3 + from - 9;
    }
    if (from === 11) {
      if (to === 12) return 4;
      if (to === 13) return 6;
      if (to === 14) return 8;
      if (to === 16) return 5;
      if (to === 17) return 7;
      if (to === 18) return 9;
    }
    if (from === 12) {
      if (to === 13) return 4;
      if (to === 14) return 6;
      if (to === 15) return 5;
      if (to === 17) return 5;
      if (to === 18) return 7;
    }
    if (from === 13) {
      if (to === 14) return 4;
      if (to === 15) return 7;
      if (to === 16) return 5;
      if (to === 18) return 5;
    }
    if (from === 14) {
      if (to === 15) return 9;
      if (to === 16) return 7;
      if (to === 17) return 5;
    }
    if (from === 15) {
      if (to === 16) return 6;
      if (to === 17) return 8;
      if (to === 18) return 10;
    }
    if (from === 16) {
      if (to === 17) return 6;
      if (to === 18) return 8;
    }
    if (from === 17) return 6;
  }

  d(from, to) {
    const mismatches = []
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

    for (let i = 11; i < state.length; i += 1) {
      if (state[i] === '.') score += 10 ** ((i - 11) % 4);
    }

    return score;
  }

  isUnblockedMove(from, to, state) {
    if (from === 0 || from === 1) {
      if (state[1] !== '.' && from !== 1) return false;
      if (to === 11) return state[15] !== '.';
      if (to === 15) return true;
      if (state[3] !== '.') return false;
      if (to === 12) return state[16] !== '.';
      if (to === 16) return true;
      if (state[5] !== '.') return false;
      if (to === 13) return state[17] !== '.';
      if (to === 17) return true;
      if (state[7] !== '.') return false;
      if (to === 14) return state[18] !== '.';
      return true;
    }
    if (from === 3) {
      if (to === 11) return state[15] !== '.';
      if (to === 15) return true;
      if (to === 12) return state[16] !== '.';
      if (to === 16) return true;
      if (state[5] !== '.') return false;
      if (to === 13) return state[17] !== '.';
      if (to === 17) return true;
      if (state[7] !== '.') return false;
      if (to === 14) return state[18] !== '.';
      return true;
    }
    if (from === 5) {
      if (to === 12) return state[16] !== '.';
      if (to === 16) return true;
      if (to === 13) return state[17] !== '.';
      if (to === 17) return true;
      if (to === 11) return state[15] !== '.' && state[3] === '.'
      if (to === 15) return state[3] === '.';
      if (to === 14) return state[18] !== '.' && state[7] === '.'
      return state[7] === '.';
    }
    if (from === 7) {
      if (to === 14) return state[18] !== '.';
      if (to === 18) return true;
      if (to === 13) return state[17] !== '.';
      if (to === 17) return true;
      if (state[5] !== '.') return false;
      if (to === 12) return state[16] !== '.';
      if (to === 16) return true;
      if (state[3] !== '.') return false;
      if (to === 11) return state[15] !== '.';
      return true;
    }
    if (from === 9 || from === 10) {
      if (state[9] !== '.' && from !== 9) return false;
      if (to === 14) return state[18] !== '.';
      if (to === 18) return true;
      if (state[7] !== '.') return false;
      if (to === 13) return state[17] !== '.';
      if (to === 17) return true;
      if (state[5] !== '.') return false;
      if (to === 12) return state[16] !== '.';
      if (to === 16) return true;
      if (state[3] !== '.') return false;
      if (to === 11) return state[15] !== '.';
      return true;
    }
    if (from === 11) {
      if (state[15] === 'A' && state[11] === 'A') return false;
      if (to === 1) return true;
      if (to === 0) return state[1] === '.';
      if (state[3] !== '.') return false;
      if (to === 12) return state[16] !== '.';
      if (to === 16) return true;
      if (state[5] !== '.') return false;
      if (to === 13) return state[17] !== '.';
      if (to === 17) return true;
      if (state[7] !== '.') return false;
      if (to === 14) return state[18] !== '.';
      return true;
    }
    if (from === 12) {
      if (state[16] === 'B' && state[12] === 'B') return false;
      if (to === 11) return state[15] !== '.' && state[3] === '.';
      if (to === 15 || to < 2) return state[3] === '.';
      if (state[5] !== '.') return false;
      if (to === 13) return state[17] !== '.';
      if (to === 17) return true;
      if (state[7] !== '.') return false;
      if (to === 14) return state[18] !== '.';
      return true;
    }
    if (from === 13) {
      if (state[17] === 'C' && state[13] === 'C') return false;
      if (to === 14) return state[18] !== '.' && state[7] === '.';
      if (to === 18 || to === 9 || to === 10) return state[7] === '.';
      if (state[5] !== '.') return false;
      if (to === 12) return state[16] !== '.';
      if (to === 16) return true;
      if (state[3] !== '.') return false;
      if (to === 11) return state[15] !== '.';
      return true;
    }
    if (from === 14) {
      if (state[18] === 'D' && state[14] === 'D') return false;
      if (to === 9) return true;
      if (to === 10) return state[9] === '.';
      if (state[7] !== '.') return false;
      if (to === 13) return state[17] !== '.';
      if (to === 17) return true;
      if (state[5] !== '.') return false;
      if (to === 12) return state[16] !== '.';
      if (to === 16) return true;
      if (state[3] !== '.') return false;
      if (to === 11) return state[15] !== '.';
      return true;
    }
    if (from === 15) {
      if (state[15] === 'A') return false;
      if (state[11] !== '.') return false;
      if (to === 1) return true;
      if (to === 0) return state[1] === '.';
      if (state[3] !== '.') return false;
      if (to === 12) return state[16] !== '.';
      if (to === 16) return true;
      if (state[5] !== '.') return false;
      if (to === 13) return state[17] !== '.';
      if (to === 17) return true;
      if (state[7] !== '.') return false;
      if (to === 14) return state[18] !== '.';
      return true;
    }
    if (from === 16) {
      if (state[16] === 'B') return false;
      if (state[12] !== '.') return false;
      if (to === 11) return state[15] !== '.' && state[3] === '.';
      if (to === 15 || to < 2) return state[3] === '.';
      if (state[5] !== '.') return false;
      if (to === 13) return state[17] !== '.';
      if (to === 17) return true;
      if (state[7] !== '.') return false;
      if (to === 14) return state[18] !== '.';
      return true;
    }
    if (from === 17) {
      if (state[17] === 'C') return false;
      if (state[13] !== '.') return false;
      if (to === 14) return state[18] !== '.' && state[7] === '.';
      if (to === 18 || to === 9 || to === 10) return state[7] === '.';
      if (state[5] !== '.') return false;
      if (to === 12) return state[16] !== '.';
      if (to === 16) return true;
      if (state[3] !== '.') return false;
      if (to === 11) return state[15] !== '.';
      return true;
    }
    if (from === 18) {
      if (state[18] === 'D') return false;
      if (state[14] !== '.') return false;
      if (to === 9) return true;
      if (to === 10) return state[9] === '.';
      if (state[7] !== '.') return false;
      if (to === 13) return state[17] !== '.';
      if (to === 17) return true;
      if (state[5] !== '.') return false;
      if (to === 12) return state[16] !== '.';
      if (to === 16) return true;
      if (state[3] !== '.') return false;
      if (to === 11) return state[15] !== '.';
      return true;
    }
  }

  isPermittedMove(from, to, state) {
    if (to < 11) return true;
    if (to === 11 || to === 15) return state[from] === 'A';
    if (to === 12 || to === 16) return state[from] === 'B';
    if (to === 13 || to === 17) return state[from] === 'C';
    if (to === 14 || to === 18) return state[from] === 'D';
  }

  isValidMove(from, to, state) {
    return this.isPermittedMove(from, to, state) && this.isUnblockedMove(from, to, state);
  }

  moves(state) {
    const occupiedSpaces = Array.from({ length: 19 }, (_, i) => i).filter((i) => state[i] !== '.');

    const occupiedHall = [0, 1, 3, 5, 7, 9, 10].filter((i) => occupiedSpaces.includes(i));
    const unoccupiedHall = [0, 1, 3, 5, 7, 9, 10].filter((i) => !occupiedSpaces.includes(i));

    const occupiedRooms = Array.from({ length: 8}, (_, i) => i + 11).filter((i) => occupiedSpaces.includes(i));
    const unoccupiedRooms = Array.from({ length: 8}, (_, i) => i + 11).filter((i) => !occupiedSpaces.includes(i));

    const movesIntoRooms = occupiedHall.flatMap((from) => unoccupiedRooms.map((to) => ({ from, to })));
    const movesIntoHall = occupiedRooms.flatMap((from) => unoccupiedHall.map((to) => ({ from, to })));
    const movesBetweenRooms = occupiedRooms.flatMap((from) => unoccupiedRooms.map((to) => ({ from, to })));

    const allMoves = [...movesIntoRooms, ...movesIntoHall, ...movesBetweenRooms].filter(({ from, to }) => this.isValidMove(from, to, state));

    function swapStr(str, first, last){
      return str.substr(0, first)
        + str[last]
        + str.substring(first+1, last)
        + str[first]
        + str.substr(last+1);
    }
    return allMoves.map(({ from, to }) => swapStr(state, ...[from, to].sort((a, b) => a - b)));
  }

  part1 (input) {
    const [start, ...steps] = aStarSearch(
      input,
      '...........ABCDABCD',
      this.d.bind(this),
      this.h,
      this.moves.bind(this),
      0
    );
    return steps.reduce(({ state, score }, newState) => {
      return { state: newState, score: score + this.d(state, newState) };
    }, { state: start, score: 0 }).score;
  }

  part2 (input) {
    const startCondition = input.substr(0, 15) + 'DCBADBAC' + input.substr(15);

    return startCondition.length;
  }
}
