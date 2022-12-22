import { QuestionBase } from '../../utils/question-base.js';
import { triangle } from '../../utils/triangle-utils.js';
import { PriorityQueue } from '../../utils/priority-queue.js';

export class Question extends QuestionBase {
  constructor() {
    super(2022, 19, 1389, 3003);

    this.exampleInput({
      input: [
        'Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.',
        'Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.'
      ],
      part1: 33,
      part2: 56 * 62
    });
  }

  parseLine(line) {
    const [, id, oreOre, clayOre, obsidianOre, obsidianClay, geodeOre, geodeObsidian] = /Blueprint (\d+): Each ore robot costs (\d+) ore\. Each clay robot costs (\d+) ore\. Each obsidian robot costs (\d+) ore and (\d+) clay\. Each geode robot costs (\d+) ore and (\d+) obsidian\./.exec(line).map(Number);
    return {
      id,
      ore: { ore: oreOre },
      clay: { ore: clayOre },
      obsidian: { ore: obsidianOre, clay: obsidianClay },
      geode: { ore: geodeOre, obsidian: geodeObsidian }
    };
  }

  step({ amount, robots }) {
    return { amount: amount + robots, robots };
  }

  baseStep({ time, ...state }) {
    return {
      time: time - 1,
      ...Object.fromEntries(Object.entries(state).map(([k, s]) => [k, this.step(s)]))
    };
  }

  makeRobot(output, blueprint, state) {
    const { [output]: { ore = 0, clay = 0, obsidian = 0 } } = blueprint;
    const newState = this.baseStep(state);

    newState[output].robots += 1;
    newState.ore.amount -= ore;
    newState.clay.amount -= clay;
    newState.obsidian.amount -= obsidian;

    return newState;
  }

  neighbours(blueprint, state) {
    if (state.time === 0) return [];

    // Always build a geode robot if possible
    const canBuildGeode = state.obsidian.amount >= blueprint.geode.obsidian && state.ore.amount >= blueprint.geode.ore;
    if (canBuildGeode) {
      return [this.makeRobot('geode', blueprint, state)];
    }

    const out = [];

    // No point having more obsidian robots than the amount needed for a geode robot
    const shouldBuildObsidian = state.obsidian.robots < blueprint.geode.obsidian;
    const shouldBuildClay = shouldBuildObsidian && state.clay.robots < blueprint.obsidian.clay;
    const shouldBuildOre = (shouldBuildObsidian && state.ore.robots < blueprint.obsidian.ore) || (shouldBuildClay && state.ore.robots < blueprint.clay.ore) || (state.ore.robots < blueprint.geode.ore);

    const buildObsidian = shouldBuildObsidian && state.clay.amount >= blueprint.obsidian.clay && state.ore.amount >= blueprint.obsidian.ore;
    if (buildObsidian) out.push(this.makeRobot('obsidian', blueprint, state));

    const buildClay = shouldBuildClay && state.ore.amount >= blueprint.clay.ore;
    if (buildClay) out.push(this.makeRobot('clay', blueprint, state));

    const buildOre = shouldBuildOre && state.ore.amount >= blueprint.ore.ore;
    if (buildOre) out.push(this.makeRobot('ore', blueprint, state));

    out.push(this.baseStep(state));

    return out;
  }

  potential(blueprint, state) {
    return state.geode.amount + (state.geode.robots * state.time) + triangle(state.time - 1);
  }

  maxGeodes(blueprint, time) {
    const start = {
      ore: { amount: 0, robots: 1 },
      clay: { amount: 0, robots: 0 },
      obsidian: { amount: 0, robots: 0 },
      geode: { amount: 0, robots: 0 },
      time
    };

    const queue = new PriorityQueue((a, b) => this.potential(blueprint, a) > this.potential(blueprint, b));
    queue.push(start);

    let best = 0;
    const seen = new Set();

    while (!queue.isEmpty()) {
      const current = queue.pop();
      if (seen.has(JSON.stringify(current))) {
        continue;
      }
      seen.add(JSON.stringify(current));
      if (this.potential(blueprint, current) < best) {
        return best;
      }
      if (current.time === 0) {
        best = this.potential(blueprint, current);
      }

      this.neighbours(blueprint, current)
        .filter((neighbour) => this.potential(blueprint, neighbour) > best)
        .forEach((neighbour) => queue.push(neighbour));
    }

    return best;
  }

  part1(input, time = 24) {
    return input.map(({
      id,
      ...blueprint
    }) => this.maxGeodes(blueprint, time) * id).reduce((a, b) => a + b);
  }

  part2(input, time = 32) {
    return input.slice(0, 3).map(({
      id,
      ...blueprint
    }) => this.maxGeodes(blueprint, time)).reduce((a, b) => a * b);
  }
}
