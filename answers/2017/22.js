import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2017, 22, 5450, 2511957);

    this.exampleInput({ input: ['..#', '#..', '...'], part1: 5587, part2: 2511944 });
  }

  get parser() {
    return Parsers.FLAT_MAP;
  }

  postParse(nodes) {
    const width = Math.sqrt(nodes.length);
    const middle = ~~(width / 2);
    return nodes.reduce((sofar, node, ix) => {
      if (node === '.') return sofar;
      const x = (ix % width) - middle;
      const y = ~~(ix / width) - middle;
      return { ...sofar, [`${x}:${y}`]: 2 };
    }, {});
  }

  get mutates() {
    return true;
  }

  part1(input) {
    let x = 0;
    let y = 0;
    let dir = 'N';
    let infections = 0;

    const isInfected = () => !!input[`${x}:${y}`];

    const rotate = (inf) => {
      const dirix = ['N', 'E', 'S', 'W'].indexOf(dir);
      const delta = inf ? 1 : -1;
      dir = ['N', 'E', 'S', 'W'][(dirix + 4 + delta) % 4];
    };

    const alterInfection = (inf) => {
      if (!inf) infections += 1;
      input[`${x}:${y}`] = !inf;
    };

    const move = () => {
      if (dir === 'N') y -= 1;
      if (dir === 'E') x += 1;
      if (dir === 'S') y += 1;
      if (dir === 'W') x -= 1;
    };

    const burst = () => {
      const inf = isInfected();
      rotate(inf);
      alterInfection(inf);
      move();
    };

    for (let i = 0; i < 10000; i += 1) {
      burst();
    }

    return infections;
  }

  part2(input) {
    let x = 0;
    let y = 0;
    let dir = 'N';
    let infections = 0;

    const infectionStatus = () => input[`${x}:${y}`] || 0;

    const rotate = (inf) => {
      const dirix = ['N', 'E', 'S', 'W'].indexOf(dir);
      const delta = inf - 1;
      dir = ['N', 'E', 'S', 'W'][(dirix + 4 + delta) % 4];
    };

    const alterInfection = (inf) => {
      if (inf === 1) infections += 1;
      input[`${x}:${y}`] = (inf + 1) % 4;
    };

    const move = () => {
      if (dir === 'N') y -= 1;
      if (dir === 'E') x += 1;
      if (dir === 'S') y += 1;
      if (dir === 'W') x -= 1;
    };

    const burst = () => {
      const inf = infectionStatus();
      rotate(inf);
      alterInfection(inf);
      move();
    };

    for (let i = 0; i < 10000000; i += 1) {
      burst();
    }

    return infections;
  }
}
