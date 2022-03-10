import { QuestionBase, Parsers } from '../../utils/question-base.js';

class Map {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.d = -1;

    this.rows = { };
    this.stack = [];
    this.addRoom();
    this.branch();
  }

  get rooms() {
    return Object.values(this.rows).flatMap((row) => Object.values(row));
  }

  addRoom() {
    this.rows[this.y] = this.rows[this.y] || {};
    const existing = this.rows[this.y][this.x];
    if (existing) {
      this.d = existing.d;
    } else {
      this.d += 1;
      const { x, y, d } = this;
      this.rows[y][x] = { x, y, d };
    }
  }

  go(direction) {
    switch(direction) {
      case 'N':
        this.y -= 1;
        break;
      case 'E':
        this.x += 1;
        break;
      case 'S':
        this.y += 1;
        break;
      case 'W':
        this.x -= 1;
        break;
    }
    this.addRoom();
    return this;
  }

  branch() {
    this.stack.push({ x: this.x, y: this.y, d: this.d });
    return this;
  }

  switch() {
    const { x, y, d } = this.stack[this.stack.length - 1];
    this.x = x;
    this.y = y;
    this.d = d;
    return this;
  }

  pop() {
    const { x, y, d } = this.stack.pop();
    this.x = x;
    this.y = y;
    this.d = d;
    return this;
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2018, 20, 3806, 8354);

    this.exampleInput({ input: '^WNE$', part1: 3 });
    this.exampleInput({ input: '^ENWWW(NEEE|SSE(EE|N))$', part1: 10 });
    this.exampleInput({ input: '^ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN$', part1: 18 });
    this.exampleInput({ input: '^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$', part1: 23 });
    this.exampleInput({
      input: '^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$',
      part1: 31
    });
  }

  get parser() {
    return Parsers.FLAT_MAP;
  }

  postParse(input) {
    const map = new Map();

    return input.slice(1, -1).reduce((map, char) => {
      switch (char) {
        case '(':
          return map.branch();
        case '|':
          return map.switch();
        case ')':
          return map.pop();
        default:
          return map.go(char);
      }
    }, map);
  }

  part1(map) {
    return map.rooms.map(({ d }) => d).reduce((a, b) => Math.max(a, b));
  }

  part2(map) {
    return map.rooms.filter(({ d }) => d >= 1000).length;
  }
}
