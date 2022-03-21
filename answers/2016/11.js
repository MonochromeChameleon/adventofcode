import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { dijkstra } from '../../utils/dijkstra.js';

class State {
  constructor(elevator = 0, floors = []) {
    this.elevator = elevator;
    this.floors = floors;
  }

  addLine(line) {
    const [, ...items] = line
      .replace(/\.$/, '')
      .replace('contains', 'contains,')
      .replace(' and ', ', ')
      .replace(',,', ',')
      .split(', a ');
    const flitems = items.map((item) => {
      const [element, ...rest] = item.split(/(-|\s)/);
      const type = rest[rest.length - 1][0];
      return { element: element.slice(0, 2), type };
    });
    this.floors.push(flitems);
  }

  toString() {
    const floors = this.floors
      .map((items) =>
        items
          .sort((a, b) => a.element.localeCompare(b.element) || a.type.localeCompare(b.type))
          .map(({ element, type }) => `${element}:${type}`)
          .join(',')
      )
      .join('|');
    return `${this.elevator}|${floors}`;
  }

  get targetState() {
    const allItems = this.floors.flat(Infinity);
    const topFloor = this.floors.length - 1;
    const targetFloors = this.floors.map((f, ix) => (ix === topFloor ? allItems : []));
    return new State(topFloor, targetFloors);
  }

  get isStable() {
    return this.floors.every((items) => {
      const generators = items.filter((item) => item.type === 'g');
      const microchips = items.filter((item) => item.type === 'm');

      if (generators.length === 0) return true;
      if (microchips.length === 0) return true;

      return microchips.every((chip) => generators.some((gen) => gen.element === chip.element));
    });
  }

  moveItems(itemsToMove, toFloor) {
    const floors = JSON.parse(JSON.stringify(this.floors));
    const items = floors[this.elevator];
    floors[this.elevator] = items.filter(
      (item) => !itemsToMove.some(({ element, type }) => item.element === element && item.type === type)
    );
    floors[toFloor] = itemsToMove.concat(floors[toFloor]);
    return new State(toFloor, floors);
  }

  neighbours() {
    const minFloor = this.floors.findIndex((items) => items.length > 0);
    const currentItems = this.floors[this.elevator];

    const moveUpPairs = [this.elevator + 1]
      .filter((it) => it < this.floors.length)
      .flatMap((upFloor) => {
        const pairs = currentItems
          .map((item, ix) => currentItems.slice(ix + 1).map((otherItem) => [item, otherItem]))
          .flat();
        const matching = pairs.find(([a, b]) => a.element === b.element);
        const mismatched = pairs.filter(([a, b]) => a.element !== b.element);
        return [matching, ...mismatched].filter((it) => it).map((pair) => this.moveItems(pair, upFloor));
      })
      .filter((state) => state.isStable)
      .map((state) => state.toString());

    const moveUpSingles = [this.elevator + 1]
      .filter((it) => !moveUpPairs.length && it < this.floors.length)
      .flatMap((upFloor) => currentItems.map((item) => this.moveItems([item], upFloor)))
      .filter((state) => state.isStable)
      .map((state) => state.toString());

    const moveDownSingles = [this.elevator - 1]
      .filter((it) => it >= minFloor)
      .flatMap((downFloor) => currentItems.map((item) => this.moveItems([item], downFloor)))
      .filter((state) => state.isStable)
      .map((state) => state.toString());

    const moveDownPairs = [this.elevator - 1]
      .filter((it) => !moveDownSingles.length && it >= minFloor)
      .flatMap((downFloor) => {
        const pairs = currentItems
          .map((item, ix) => currentItems.slice(ix + 1).map((otherItem) => [item, otherItem]))
          .flat();
        const matching = pairs.find(([a, b]) => a.element === b.element);
        const mismatched = pairs.filter(([a, b]) => a.element !== b.element);
        return [matching, ...mismatched].filter((it) => it).map((pair) => this.moveItems(pair, downFloor));
      })
      .filter((state) => state.isStable)
      .map((state) => state.toString());

    return [...moveUpPairs, ...moveUpSingles, ...moveDownPairs, ...moveDownSingles];
  }
}

State.fromString = (str) => {
  const [elevator, ...floors] = str.split('|').map((part, ix) => {
    if (!ix) return Number(part);
    return part
      .split(',')
      .filter((it) => it)
      .map((item) => item.split(':'))
      .map(([element, type]) => ({
        element,
        type,
      }));
  });
  return new State(elevator, floors);
};

export class Question extends QuestionBase {
  constructor() {
    super(2016, 11, 31, 55);

    this.exampleInput({ part1: 11 });
  }

  get parser() {
    return Parsers.REDUCE;
  }

  get reducer() {
    return State;
  }

  part1(input) {
    return dijkstra({
      start: input.toString(),
      goal: input.targetState.toString(),
      neighbours: (state) => State.fromString(state).neighbours(),
      output: 'distance',
    }).getOrThrow();
  }

  part2(input) {
    const extras = [
      { element: 'el', type: 'g' },
      { element: 'el', type: 'm' },
      { element: 'di', type: 'g' },
      { element: 'di', type: 'm' },
    ];
    // Just move the extra items to the top and then run the same algorithm
    return extras.length * 2 * (input.floors.length - 1) + this.answers.part1;
  }
}
