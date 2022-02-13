import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { countBy } from '../../utils/count-by-value.js';

const STARTING_STATE = [0, 1, 0, 0, 0, 1, 1, 1, 1];

const rotate = (state) =>
  state.length === 4
    ? [state[2], state[0], state[3], state[1]]
    : [state[6], state[3], state[0], state[7], state[4], state[1], state[8], state[5], state[2]];

const flip = (state) =>
  state.length === 4
    ? [state[1], state[0], state[3], state[2]]
    : [state[2], state[1], state[0], state[5], state[4], state[3], state[8], state[7], state[6]];

class Rule {
  constructor(line) {
    const [, from, to] = line.match(/^(.+)\s+=>\s+(.+)$/);
    const match = from
      .replaceAll('/', '')
      .split('')
      .map((it) => (it === '#' ? 1 : 0));
    this.match = match;
    this.length = match.length;

    this.matches = [
      ...Array.from({ length: 4 }).reduce((out) => [match, ...out.map(rotate)], []),
      ...Array.from({ length: 4 }).reduce((out) => [flip(match), ...out.map(rotate)], []),
    ]
      .map((it) => it.join(''))
      .reduce((out, it) => (out.includes(it) ? out : [...out, it]), []);

    this.enhanced = to
      .replaceAll('/', '')
      .split('')
      .map((it) => (it === '#' ? 1 : 0));
  }

  isMatch(state) {
    if (state.length !== this.length) return false;
    const match = state.join('');
    return this.matches.some((it) => it === match);
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2017, 21, 120, 2204099);
    this.wip = true;

    this.exampleInput({ filename: '21a', part1: 12 }, 2);
  }

  get parser() {
    return Parsers.MULTI_LINE_CONSTRUCTOR;
  }

  get inputConstructor() {
    return Rule;
  }

  twoByTwo(state) {
    const width = Math.sqrt(state.length / 4);
    return Array.from({ length: state.length / 4 }, (_, i) => {
      const row = ~~(i / width);
      const rowStartIx = 4 * width * row;
      const numInRow = i % width;
      const cellStartIx = rowStartIx + 2 * numInRow;
      return [
        state[cellStartIx],
        state[cellStartIx + 1],
        state[cellStartIx + 2 * width],
        state[cellStartIx + 2 * width + 1],
      ];
    });
  }

  threeByThree(state) {
    const width = Math.sqrt(state.length / 9);
    return Array.from({ length: state.length / 9 }, (_, i) => {
      const row = ~~(i / width);
      const rowStartIx = 9 * width * row;
      const numInRow = i % width;
      const cellStartIx = rowStartIx + 3 * numInRow;
      return [
        state[cellStartIx],
        state[cellStartIx + 1],
        state[cellStartIx + 2],
        state[cellStartIx + 3 * width],
        state[cellStartIx + 3 * width + 1],
        state[cellStartIx + 3 * width + 2],
        state[cellStartIx + 6 * width],
        state[cellStartIx + 6 * width + 1],
        state[cellStartIx + 6 * width + 2],
      ];
    });
  }

  join(size, groups) {
    const width = Math.sqrt(groups.length);
    return Array.from({ length: width }).flatMap((_, groupRow) =>
      Array.from({ length: size }).flatMap((__, row) =>
        Array.from({ length: width }).flatMap((___, groupCol) => {
          const group = groups[groupRow * width + groupCol];
          return Array.from({ length: size }).flatMap((____, col) => group[row * size + col]);
        })
      )
    );
  }

  enhance(rules, state) {
    if (state.length === 4 || state.length === 9) {
      return rules.find((rule) => rule.isMatch(state)).enhanced;
    }
    if (state.length % 2 === 0) {
      const enhanced = this.twoByTwo(state).map((s) => this.enhance(rules, s));
      return this.join(3, enhanced);
    }
    const enhanced = this.threeByThree(state).map((s) => this.enhance(rules, s));
    return this.join(4, enhanced);
  }

  part1(rules, iterations = 5) {
    return Array.from({ length: iterations })
      .reduce((state) => this.enhance(rules, state), STARTING_STATE)
      .reduce((a, b) => a + b);
  }

  part2(rules, iterations = 18) {
    const ruleMapper = rules
      .filter(({ length }) => length === 9)
      .reduce((out, rule) => {
        const afterThree = Array.from({ length: 3 }).reduce((state) => this.enhance(rules, state), rule.match);
        const splitAfterThree = this.threeByThree(afterThree);
        const countAfterThree = afterThree.reduce((a, b) => a + b);
        return {
          ...out,
          [rule.match.join('')]: {
            countAfterThree,
            next: countBy(splitAfterThree, (it) => rules.find((r) => r.isMatch(it)).match.join('')),
          },
        };
      }, {});

    const startKey = rules.find((it) => it.isMatch(STARTING_STATE)).match.join('');

    const after = Array.from({ length: iterations / 3 - 1 }).reduce(
      (states) =>
        Object.entries(states).reduce((out, [key, count]) => {
          // const keyMatch = rules.find(it => it.isMatch(key.split(''))).match.join('');
          const { next } = ruleMapper[key];
          Object.entries(next).forEach(([nextKey, nextCount]) => {
            out[nextKey] = (out[nextKey] || 0) + nextCount * count;
          });
          return out;
        }, {}),
      { [startKey]: 1 }
    );

    return Object.entries(after).reduce((tot, [key, count]) => tot + count * ruleMapper[key].countAfterThree, 0);
  }
}
