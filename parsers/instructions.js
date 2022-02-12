import { Parser } from './parser.js';

export class InstructionsParser extends Parser {

  parseInstruction(line) {
    return line.split(' ')[0];
  }

  parseParams(line) {
    const [, ...params] = line.split(' ');
    return params.map((p) => Number.isNaN(Number(p)) ? p : Number(p));
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
    { optimize = false, limit = Infinity, breakFn = () => false, defaultValue = 0, ...extraCommands } = {},
    ...params
  ) {
    const baseState = this.defaultParams(startCondition, ...params);
    const state = {
      instructions: JSON.parse(JSON.stringify(instructions)),
      pointer: 0,
      output: [],
      ...baseState,
      get instruction() {
        return this.instructions[this.pointer];
      },
      getValue(param) {
        if (param in this) {
          return this[param];
        }
        if (Number.isInteger(param)) {
          return param;
        }
        return defaultValue;
      },
    };

    let count = 0;

    while (state.instruction && !breakFn(state) && count < limit) {
      if (optimize && this.canOptimize.call(state)) {
        this.optimize.call(state);
      } else {
        const { instruction, params } = state.instruction;
        (extraCommands[instruction] || this[instruction]).call(state, ...params);
        if (this.autoIncrementPointer(instruction)) {
          state.pointer += 1;
        }
      }
      count += 1;
    }
    return state;
  }
}
