import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2021, 16, 913, 1510977819698);

    this.exampleInput({ filename: 'testinputs/16', part1: 31, part2: 54 });
  }

  getValue(type, packets) {
    const values = packets.map(({ value }) => value);
    switch (type) {
      case 0:
        return values.reduce((a, b) => a + b);
      case 1:
        return values.reduce((a, b) => a * b);
      case 2:
        return Math.min(...values);
      case 3:
        return Math.max(...values);
      case 5:
        return values[0] > values[1] ? 1 : 0;
      case 6:
        return values[0] < values[1] ? 1 : 0;
      case 7:
        return values[0] === values[1] ? 1 : 0;
    }
  }

  processSubPackets(input) {
    const lengthType = Number(input[0]);
    if (lengthType === 0) {
      const lengthInBits = parseInt(input.substr(1, 15), 2);
      const subPacketBits = input.substr(16, lengthInBits);
      const packets = this.processPacket(subPacketBits);
      const rest = input.substr(16 + lengthInBits);
      return { packets, rest };
    }
    const lengthInPackets = parseInt(input.substr(1, 11), 2);
    const packets = this.processPacket(input.substr(12), lengthInPackets);
    const { rest } = packets.pop();
    return { packets, rest };
  }

  processPacket(input, limit = Infinity) {
    if (limit === 0) return [{ rest: input }];
    if (!input || !input.length || parseInt(input, 2) === 0) return [];

    const version = parseInt(input.substr(0, 3), 2);
    const type = parseInt(input.substr(3, 3), 2);
    let rest = input.slice(6);

    if (type === 4) {
      let digits = '';
      while (rest[0] === '1') {
        digits += rest.substr(1, 4);
        rest = rest.slice(5);
      }
      digits += rest.substr(1, 4);
      rest = rest.slice(5);
      const value = parseInt(digits, 2);
      return [{ version, type, value, versionSum: version }, ...this.processPacket(rest, limit - 1)];
    }
    const { packets, rest: newRest } = this.processSubPackets(rest);
    const versionSum = packets.reduce((sum, { versionSum: v }) => sum + v, version);
    const value = this.getValue(type, packets);
    return [{ version, type, packets, value, versionSum }, ...this.processPacket(newRest, limit - 1)];
  }

  parseLine(line) {
    return line
      .split('')
      .map((c) => parseInt(c, 16).toString(2).padStart(4, '0'))
      .join('');
  }

  parseInput(lines) {
    const binary = lines.map(this.parseLine).join('');
    return this.processPacket(binary);
  }

  part1([{ versionSum }]) {
    return versionSum;
  }

  part2([{ value }]) {
    return value;
  }
}
