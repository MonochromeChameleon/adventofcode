import { Parser } from './parser.js';

export class InstructionsParser extends Parser {
  parseInstruction(line) {
    return line.split(' ')[0];
  }

  parseParams(line) {
    const [, ...params] = line.split(' ');
    return params.map((p) => (Number.isNaN(Number(p)) ? p : Number(p)));
  }

  parseLine(line) {
    const instruction = this.m.parseInstruction.call(this, line);
    const params = this.m.parseParams.call(this, line);
    return { instruction, params };
  }

  autoIncrementPointer() {
    return true;
  }

  defaultParams(params) {
    return params;
  }

  execute(
    instructions,
    startCondition = {},
    {
      optimize = false,
      limit = Infinity,
      breakFn = () => false,
      defaultValue = 0,
      debug = false,
      ...extraCommands
    } = {},
    ...args
  ) {
    const baseState = this.m.defaultParams.call(this, startCondition, ...args);
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
      count: 0,
    };

    while (state.instruction && !breakFn(state) && state.count < limit) {
      if (optimize && this.m.canOptimize.call(state, state)) {
        this.optimize.call(state);
      } else {
        const { instruction, params } = state.instruction;
        (extraCommands[instruction] || this[instruction]).call(state, ...params);
        if (this.m.autoIncrementPointer.call(state, instruction)) {
          state.pointer += 1;
        }
        if (debug) {
          const { instructions: _, instruction: __, output, getValue, ...rest } = state;
          console.log(rest); // eslint-disable-line no-console
        }
      }
      state.count += 1;
    }
    return state;
  }
}
