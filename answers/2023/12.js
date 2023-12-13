import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2023, 12, 7236, 11607695322318);

    this.exampleInput({ part1: 21, part2: 525152 });
  }

  parseLine(line) {
    const [map, groups] = line.split(' ');
    return { map, groups: groups.split(',').map(Number) };
  }

  countPermutations(map, groups) {
    if (!map.length) return groups.length ? 0 : 1;
    if (!groups.length) return /#/.test(map) ? 0 : 1;
    if (map.length < groups.length + groups.reduce((a, b) => a + b) - 1) return 0;
    switch (map[0]) {
      case '.': {
        const mindex = Math.min(...[map.indexOf('?'), map.indexOf('#')].filter((i) => i > 0));
        return this.withCache.countPermutations(map.slice(mindex), groups);
      }
      case '#':
        return /^[#?]+$/.test(map.slice(0, groups[0])) && map[groups[0]] !== '#'
          ? this.withCache.countPermutations(map.slice(groups[0] + 1), groups.slice(1))
          : 0;
      default:
        return ['.', '#'].reduce(
          (tot, char) => tot + this.withCache.countPermutations(`${char}${map.slice(1)}`, groups),
          0,
        );
    }
  }

  part1(input) {
    return input.reduce(
      (total, { map, groups }) => total + this.withCache.countPermutations(map.replace(/\.+$/, ''), groups),
      0,
    );
  }

  part2(input) {
    return input
      .map(({ map, groups }) => ({
        map: new Array(5).fill(map).join('?').replace(/\.+$/, ''),
        groups: new Array(5).fill(groups).flat(),
      }))
      .reduce((total, { map, groups }) => total + this.withCache.countPermutations(map, groups), 0);
  }
}
