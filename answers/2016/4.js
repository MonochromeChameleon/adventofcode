import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2016, 4, 361724, 482);
    this.exampleInput({ input: 'aaaaa-bbb-z-y-x-123[abxyz]', part1: 123 });
    this.exampleInput({ input: 'a-b-c-d-e-f-g-h-987[abcde]', part1: 987 });
    this.exampleInput({ input: 'not-a-real-room-404[oarel]', part1: 404 });
    this.exampleInput({ input: 'totally-real-room-200[decoy]', part1: 0 });
  }

  get parser() {
    return Parsers.MULTI_LINE_MAP;
  }

  map(value) {
    const [_, name, id, checksum] = value.match(/^(.+)-(\d+)\[(.+)]$/);
    return { name, sector: Number(id), checksum };
  }

  isRealRoom({ name, checksum }) {
    const letters = name
      .replaceAll(/-/g, '')
      .split('')
      .reduce((acc, letter) => {
        acc[letter] = (acc[letter] || 0) + 1;
        return acc;
      }, {});

    const values = [...new Set(Object.values(letters))].sort((a, b) => b - a);
    const fullCheck = values
      .flatMap((value) =>
        Object.entries(letters)
          .filter(([, v]) => v === value)
          .map(([k]) => k)
          .sort(),
      )
      .join('');
    return fullCheck.slice(0, 5) === checksum;
  }

  decodeRoom({ name, sector }) {
    const modSector = sector % 26;

    const decoded = name
      .split('-')
      .map((word) => {
          return word
            .split('')
            .map((letter) => {
              const rotated = letter.charCodeAt(0) + modSector;
              return String.fromCharCode(rotated > 122 ? rotated - 26 : rotated);
            })
            .join('');
        },
      )
      .join(' ');

    return { name: decoded, sector };
  }

  part1(input) {
    return input.filter((room) => this.isRealRoom(room)).reduce((sum, room) => sum + room.sector, 0);
  }

  part2(input) {
    return input
      .filter((room) => this.isRealRoom(room))
      .map((room) => this.decodeRoom(room))
      .find((room) => room.name === 'northpole object storage').sector;
  }
}
