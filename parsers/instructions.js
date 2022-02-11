import { Parser } from './parser.js';

export class InstructionsParser extends Parser {

  parseInstruction(line) {
    return line.split(' ')[0];
  }

  parseLine(line) {
    const instruction = this.parseInstruction(line);
    const params = this.parseParams(line);
    return { instruction, params };
  }

  canOptimize() {
    return false;
  }

  autoIncrementPointer() {
    return true;
  }

  defaultParams(params) {
    return params;
  }

  execute(
    instructions,
    startCondition = { },
    { optimize = false, limit = Infinity, breakFn = () => false } = {},
    ...params
  ) {
    const baseState = this.defaultParams(startCondition, ...params);
    const state = {
      ...baseState,
      pointer: 0,
      instructions: JSON.parse(JSON.stringify(instructions)),
      get instruction() {
        return this.instructions[this.pointer];
      },
      output: []
    };

    let count = 0;

    while (state.instruction && !breakFn(state) && count < limit) {
      if (optimize && this.canOptimize.call(state)) {
        this.optimize.call(state);
      } else {
        const { instruction, params } = state.instruction;
        this[instruction].call(state, ...params);
        if (this.autoIncrementPointer(instruction)) {
          state.pointer += 1;
        }
      }
      count += 1;
    }
    return state;
  }
}
