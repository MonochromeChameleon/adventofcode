import { QuestionWithParser } from '../../utils/question-with-parser.js';
import * as Parsers from '../../parsers/parsers.js';
import { flattenObject } from '../../utils/object-utils.js';

export class Question extends QuestionWithParser {
  constructor() {
    super(2015, 12, 111754, 65402);

    this.exampleInput({ input: '[1,2,3]', part1: 6, part2: 6 });
    this.exampleInput({ input: '{"a":2,"b":4}', part1: 6 });
    this.exampleInput({ input: '[[[3]]]', part1: 3 });
    this.exampleInput({ input: '{"a":{"b":4},"c":-1}', part1: 3 });
    this.exampleInput({ input: '{"a":[-1,1]}', part1: 0 });
    this.exampleInput({ input: '[-1,{"a":1}]', part1: 0 });
    this.exampleInput({ input: '[]', part1: 0 });
    this.exampleInput({ input: '{}', part1: 0 });
    this.exampleInput({ input: '[1,{"c":"red","b":2},3]', part2: 4 });
    this.exampleInput({ input: '{"d":"red","e":[1,2,3,4],"f":5}', part2: 0 });
    this.exampleInput({ input: '[1,"red",5]', part2: 6 });
  }

  get parser() {
    return Parsers.SINGLE_LINE_MAP;
  }

  get map() {
    return (line) => flattenObject(JSON.parse(line));
  }

  part1(input) {
    return Object.values(input).reduce((sum, val) => Number.isInteger(val) ? sum + val : sum, 0);
  }

  part2(input) {
    const redKeys = Object.entries(input)
      .filter(([key, val]) => val === 'red' && !/(^|\.)\d+$/.test(key))
      .map(([key]) => /\./.test(key) ? key.replace(/\.[^.]+$/, '.') : '');

    return Object.entries(input).reduce((sum, [key, val]) => {
      if (redKeys.some(parent => key.startsWith(parent))) return sum;
      return Number.isInteger(val) ? sum + val : sum;
    }, 0);
  }
}
