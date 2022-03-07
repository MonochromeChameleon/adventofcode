import { QuestionBase, Parsers } from '../../utils/question-base.js';

class Orc {
  constructor(type, ix, atk = 3) {
    this.type = type;
    this.ix = ix;
    this.hp = 200;
    this.atk = atk;
  }

  move(squaresInRange, occupied, maze) {
    const routeDetails = squaresInRange
      .map((ix) => {
        try {
          const route = maze.route(this.ix, ix, occupied);
          return { target: ix, route, distance: route.length };
        } catch (e) {
          return undefined;
        }
      })
      .filter(Boolean);

    const { routes, distance } = routeDetails.reduce(
      ({ routes: rtes, distance: dstnc }, route) => {
        if (route.distance < dstnc) {
          return { routes: [route], distance: route.distance };
        }
        if (route.distance === dstnc) {
          return { routes: [...rtes, route], distance: dstnc };
        }
        return { routes: rtes, distance: dstnc };
      },
      { routes: [], distance: Infinity }
    );

    if (distance === Infinity) return;
    const targetSquare = routes.map(({ target }) => target).reduce((min, tgt) => Math.min(min, tgt));
    const possibleSteps = maze.neighbours(this.ix, occupied);

    const nextRoute = possibleSteps
      .map((ix) => {
        try {
          const route = maze.route(ix, targetSquare, occupied);
          return { target: ix, route, distance: route.length };
        } catch (e) {
          return undefined;
        }
      })
      .filter(Boolean)
      .reduce((best, next) => (next.distance < best.distance ? next : best));
    this.ix = nextRoute.target;
  }

  selectTarget(targets, maze) {
    const neighbours = maze.neighbours(this.ix);
    const [weakest] = targets.filter((tgt) => neighbours.includes(tgt.ix)).sort((a, b) => a.hp - b.hp);
    return weakest;
  }

  takeTurn(orcs, maze) {
    const targets = orcs.filter(({ hp, type }) => hp > 0 && type !== this.type);

    if (!targets.length) return false;

    const occupied = orcs
      .filter(({ hp }) => hp > 0)
      .map(({ ix }) => ix)
      .filter((ix) => ix !== this.ix);
    const squaresInRange = [
      ...new Set(targets.flatMap(({ ix }) => maze.neighbours(ix)).filter((ix) => !occupied.includes(ix))),
    ];
    if (!squaresInRange.includes(this.ix)) {
      this.move(squaresInRange, occupied, maze);
    }
    if (squaresInRange.includes(this.ix)) {
      const target = this.selectTarget(targets, maze);
      this.attack(target);
    }

    return true;
  }

  attack(target) {
    target.hp -= this.atk;
  }
}

class Goblin extends Orc {
  constructor(ix) {
    super('goblin', ix);
  }
}

class Elf extends Orc {
  constructor(ix, atk = 3) {
    super('elf', ix, atk);
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2018, 15, 228240, 52626);

    this.exampleInput({ part1: 27730, part2: 4988 }, 15);
    this.exampleInput({ part1: 36334 });
    this.exampleInput({ part1: 39514, part2: 31284 }, 4);
    this.exampleInput({ part1: 27755, part2: 3478 }, 15);
    this.exampleInput({ part1: 28944, part2: 6474 }, 12);
    this.exampleInput({ part1: 18740, part2: 1140 }, 34);
  }

  get parser() {
    return Parsers.MAZE;
  }

  isBattleOver(orcs) {
    const someGoblins = orcs.some((orc) => orc.type === 'goblin' && orc.hp > 0);
    const someElves = orcs.some((orc) => orc.type === 'elf' && orc.hp > 0);

    return !(someGoblins && someElves);
  }

  attack(orcs, maze) {
    const orderedOrcs = orcs.sort((a, b) => a.ix - b.ix);
    return orderedOrcs.every((orc) => orc.hp <= 0 || orc.takeTurn(orcs, maze));
  }

  execute(maze, atk = 3) {
    const goblinsAndElves = maze.squares.reduce((orcs, sq, ix) => {
      if (sq !== 'G' && sq !== 'E') return orcs;
      const orc = sq === 'G' ? new Goblin(ix) : new Elf(ix, atk);
      return [...orcs, orc];
    }, []);

    let rounds = 0;
    while (!this.isBattleOver(goblinsAndElves)) {
      const increment = this.attack(
        goblinsAndElves.filter(({ hp }) => hp > 0),
        maze
      );
      if (increment) rounds += 1;
    }
    const remainingHp = goblinsAndElves
      .filter(({ hp }) => hp > 0)
      .map(({ hp }) => hp)
      .reduce((sum, hp) => sum + hp);
    return remainingHp * rounds;
  }

  part1(maze) {
    return this.execute(maze);
  }

  part2(maze, atk = 19) {
    // By binary chopspection, 19 is the lowest value that doesn't kill any elves
    return this.execute(maze, atk);
  }
}
