import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2016, 9, 112830, 10931789799);

    this.exampleInput({ input: 'ADVENT', part1: 6 });
    this.exampleInput({ input: 'A(1x5)BC', part1: 7 });
    this.exampleInput({ input: '(3x3)XYZ', part1: 9, part2: 9 });
    this.exampleInput({ input: 'A(2x2)BCD(2x2)EFG', part1: 11 });
    this.exampleInput({ input: '(6x1)(1x3)A', part1: 6 });
    this.exampleInput({ input: 'X(8x2)(3x3)ABCY', part1: 18, part2: 20 });
    this.exampleInput({ input: '(27x12)(20x12)(13x14)(7x10)(1x12)A', part2: 241920 });
    this.exampleInput({ input: '(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN', part2: 445 });
  }

  get parser() {
    return Parsers.SINGLE_LINE_STRING;
  }

  decompress(string, recursive = false) {
    const { out: o } = string.split('').reduce(
      ({ state, marker, out }, char) => {
        switch (state) {
          case 'normal':
            if (char === '(') {
              return { state: 'marking', marker: '', out };
            }
            out += 1;
            break;
          case 'marking':
            if (char === ')') {
              const [length, repeat] = marker.split('x').map(Number);
              return { state: 'decompressing', marker: { length, repeat, chars: '' }, out };
            }
            marker += char;
            break;
          case 'decompressing':
            marker.chars += char;
            if (marker.chars.length === marker.length) {
              const decompressed =
                marker.repeat * (recursive ? this.decompress(marker.chars, true) : marker.chars.length);
              return { state: 'normal', marker: '', out: out + decompressed };
            }
        }
        return { state, marker, out };
      },
      { state: 'normal', marker: '', out: 0 },
    );

    return o;
  }

  part1(input) {
    return this.decompress(input);
  }

  part2(input) {
    return this.decompress(input, true);
  }
}
