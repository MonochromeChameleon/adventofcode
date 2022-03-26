import { QuestionBase } from '../../utils/question-base.js';
import { Vector } from '../../utils/vector.js';

const TURN_RIGHT = [new Vector(0, -1), new Vector(1, 0)];
const TURN_LEFT = [new Vector(0, 1), new Vector(-1, 0)];
const STRAIGHT = [new Vector(1, 0), new Vector(0, 1)];
const TURN_AROUND = [new Vector(-1, 0), new Vector(0, -1)];

export class Question extends QuestionBase {
  constructor() {
    super(2020, 12, 1457, 106860);

    this.exampleInput({ input: ['F10', 'N3', 'F7', 'R90', 'F11'], part1: 25, part2: 286 });
  }

  getRotation(direction, degrees) {
    const numTurns = (degrees / 90) % 4;
    switch (direction) {
      case 'L':
        if (numTurns === 1) return TURN_LEFT;
        if (numTurns === 2) return TURN_AROUND;
        if (numTurns === 3) return TURN_RIGHT;
        return STRAIGHT;
      case 'R':
        if (numTurns === 1) return TURN_RIGHT;
        if (numTurns === 2) return TURN_AROUND;
        if (numTurns === 3) return TURN_LEFT;
        return STRAIGHT;
      default:
        return STRAIGHT;
    }
  }

  getDisplacement(direction, distance) {
    switch (direction) {
      case 'N':
        return new Vector(0, -distance);
      case 'E':
        return new Vector(distance, 0);
      case 'S':
        return new Vector(0, distance);
      case 'W':
        return new Vector(-distance, 0);
      case 'F':
        return [new Vector(distance, 0), new Vector(0, distance)];
      default:
        return new Vector(0, 0);
    }
  }

  parseLine(line) {
    const direction = line[0];
    const distance = Number(line.slice(1));

    const rotation = this.getRotation(direction, distance);
    const displacement = this.getDisplacement(direction, distance);
    return { rotation, displacement };
  }

  part1(input) {
    return input.reduce(
      ({ orientation, position }, { rotation, displacement }) => {
        const o = orientation.multiply(...rotation);
        const delta = displacement instanceof Vector ? displacement : o.multiply(...displacement);
        return { orientation: o, position: position.add(delta) };
      },
      { orientation: new Vector(1, 0), position: new Vector(0, 0) }
    ).position.manhattan;
  }

  part2(input) {
    return input.reduce(
      ({ waypoint, position }, { rotation, displacement }) => {
        if (displacement instanceof Vector) {
          return { waypoint: waypoint.multiply(...rotation).add(displacement), position };
        }
        return { waypoint, position: position.add(waypoint.multiply(...displacement)) };
      },
      { waypoint: new Vector(10, -1), position: new Vector(0, 0) }
    ).position.manhattan;
  }
}
