import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2017, 25, 4230);

    this.exampleInput({ part1: 3 });
  }

  parseInput(lines) {
    const [, startingState] = /^Begin in state (\w+).$/.exec(lines[0]);
    const [, steps] = /^Perform a diagnostic checksum after (\d+) steps.$/.exec(lines[1]).map(Number);
    const states = {};
    for (let i = 2; i < lines.length; i += 9) {
      const [, state] = /^In state (\w+):$/.exec(lines[i]);
      states[state] = {};
      for (let j = i + 1; j < i + 9; j += 4) {
        const [, currentValue] = /^\s*If the current value is (\d):$/.exec(lines[j]).map(Number);
        const [, writeValue] = /^\s*- Write the value (\d).$/.exec(lines[j + 1]).map(Number);
        const [, move] = /^\s*- Move one slot to the (\w+)\.$/.exec(lines[j + 2]).map((x) => (x === 'right' ? 1 : -1));
        const [, nextState] = /^\s*- Continue with state (\w+).$/.exec(lines[j + 3]);
        states[state][currentValue] = { writeValue, move, nextState };
      }
    }

    return { startingState, steps, states };
  }

  part1({ startingState, steps, states }) {
    const { tape: output } = Array.from({ length: steps }).reduce(
      ({ position, tape, state }) => {
        const { writeValue, move, nextState } = states[state][tape[position] || 0];
        tape[position] = writeValue;
        if (position === 0 && move === -1) tape.unshift(0);
        return { position: Math.max(position + move, 0), tape, state: nextState };
      },
      { position: 0, tape: [0], state: startingState }
    );

    return output.reduce((a, b) => a + b);
  }
}
