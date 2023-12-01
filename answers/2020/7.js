import { QuestionBase } from '../../utils/question-base.js';

const SHINY_GOLD = 'shiny gold';

export class Question extends QuestionBase {
  constructor() {
    super(2020, 7, 131, 11261);

    this.exampleInput({ part1: 4, part2: 32 });
    this.exampleInput({ part2: 126 });
  }

  parseLine(line) {
    const [desc, inside] = line.split('contain');
    const colour = desc.replace(/bags\s*$/, '').trim();
    if (inside.trim() === 'no other bags.') return { colour, contents: {}, total: 1 };
    const contents = inside
      .replace(/\.$/, '')
      .split(',')
      .map((it) => /^\s*(\d+) (.+) bag(s?)/.exec(it))
      .reduce(
        (acc, [, num, col]) => ({
          ...acc,
          [col]: Number(num),
        }),
        {},
      );
    return { colour, contents };
  }

  allPossibleBags(bags, colour) {
    const possible = bags.filter(({ contents }) => colour in contents).map(({ colour: c }) => c);
    return [...possible, ...possible.flatMap((p) => this.allPossibleBags(bags, p))];
  }

  part1(input) {
    const bags = this.allPossibleBags(input, SHINY_GOLD);
    return new Set(bags).size;
  }

  part2(input) {
    const obj = {};
    input.forEach(({ colour, contents, total }) => {
      Object.defineProperty(obj, colour, {
        get() {
          const cacheKey = `__${colour}`;
          if (!(cacheKey in obj)) {
            if (total) {
              obj[cacheKey] = total;
            } else {
              obj[cacheKey] = Object.entries(contents).reduce((tot, [c, n]) => tot + n * obj[c], 1);
            }
          }
          return obj[cacheKey];
        },
      });
    });

    return obj[SHINY_GOLD] - 1;
  }
}
