import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2022, 6, 1538, 2315);

    this.exampleInput({ input: 'mjqjpqmgbljsphdztnvjfqwrcgsmlb', part1: 7, part2: 19 });
    this.exampleInput({ input: 'bvwbjplbgvbhsrlpgdmjqwftvncz', part1: 5, part2: 23 });
    this.exampleInput({ input: 'nppdvjthqldpwncqszvftbrmjlhg', part1: 6, part2: 23 });
    this.exampleInput({ input: 'nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', part1: 10, part2: 29 });
    this.exampleInput({ input: 'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', part1: 11, part2: 26 });
  }

  get parser() {
    return Parsers.SINGLE_LINE_SPLIT;
  }

  dupeIndex([char, ...chars], window) {
    if (!chars.length) return 0;
    if (chars.includes(char)) return window - chars.length;
    return this.dupeIndex(chars, window);
  }

  part(input, window) {
    let i = 0;
    let dupe;
    while ((dupe = this.dupeIndex(input.slice(i, i + window), window))) i += dupe; // eslint-disable-line
    return i + window;
  }

  part1(input, window = 4) {
    return this.part(input, window);
  }

  part2(input, window = 14) {
    return this.part(input, window);
  }
}
