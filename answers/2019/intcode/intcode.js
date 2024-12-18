export class Intcode {
  constructor(program) {
    this.originalProgram = program;
    this.outArray = [];
    this.reset();
  }

  get instruction() {
    return this.program[this.index];
  }

  get opcode() {
    return this.instruction % 100;
  }

  updateArrayLength(newLength) {
    if (newLength > this.program.length) {
      this.program = Array.from({ length: newLength }).map((ignore, ix) => this.program[ix] || 0);
    }
  }

  next(param) {
    this.paused = false;
    switch (this.opcode) {
      case 1: {
        const targetIndex =
          this.modes[2] === 2 ? this.relativeBase + this.lookupOffset(3) : this.look(this.modes[2] || 1, 3);

        const first = this.look(this.modes[0], 1);
        const second = this.look(this.modes[1], 2);

        const outValue = first + second;

        this.updateArrayLength(targetIndex + 1);
        this.program[targetIndex] = outValue;
        this.index += 4;
        break;
      }
      case 2: {
        const targetIndex =
          this.modes[2] === 2 ? this.relativeBase + this.lookupOffset(3) : this.look(this.modes[2] || 1, 3);

        const first = this.look(this.modes[0], 1);
        const second = this.look(this.modes[1], 2);

        const outValue = first * second;

        this.updateArrayLength(targetIndex + 1);
        this.program[targetIndex] = outValue;
        this.index += 4;
        break;
      }
      case 3: {
        const targetIndex =
          this.modes[0] === 2 ? this.relativeBase + this.lookupOffset(1) : this.look(this.modes[0] || 1, 1);

        this.updateArrayLength(targetIndex + 1);
        this.program[targetIndex] = param;
        this.index += 2;
        break;
      }
      case 4: {
        const value = this.look(this.modes[0], 1);
        this.output = value;
        this.outArray.push(value);
        this.index += 2;
        this.paused = true;
        break;
      }
      case 5: {
        const first = this.look(this.modes[0], 1);
        const second = this.look(this.modes[1], 2);

        this.index = first ? second : this.index + 3;
        break;
      }
      case 6: {
        const first = this.look(this.modes[0], 1);
        const second = this.look(this.modes[1], 2);

        this.index = first ? this.index + 3 : second;
        break;
      }
      case 7: {
        const targetIndex =
          this.modes[2] === 2 ? this.relativeBase + this.lookupOffset(3) : this.look(this.modes[2] || 1, 3);

        const first = this.look(this.modes[0], 1);
        const second = this.look(this.modes[1], 2);

        const outValue = first < second ? 1 : 0;

        this.updateArrayLength(targetIndex + 1);
        this.program[targetIndex] = outValue;
        this.index += 4;
        break;
      }
      case 8: {
        const targetIndex =
          this.modes[2] === 2 ? this.relativeBase + this.lookupOffset(3) : this.look(this.modes[2] || 1, 3);

        const first = this.look(this.modes[0], 1);
        const second = this.look(this.modes[1], 2);

        const outValue = first === second ? 1 : 0;

        this.updateArrayLength(targetIndex + 1);
        this.program[targetIndex] = outValue;
        this.index += 4;
        break;
      }
      case 9: {
        const relativeShift = this.look(this.modes[0], 1);
        this.relativeBase += relativeShift;
        this.index += 2;
        break;
      }
      case 99: {
        this.paused = true;
        this.terminated = true;
        break;
      }
    }

    return this;
  }

  get modes() {
    return [100, 1000, 10000].map((p) => ~~(this.instruction / p) % 10);  
  }

  get waiting() {
    return this.opcode === 3;
  }

  look(mode, ix) {
    switch (mode) {
      case 0:
        return this.lookup(this.lookupOffset(ix));
      case 1:
        return this.lookupOffset(ix);
      case 2:
        return this.lookup(this.relativeBase + this.lookupOffset(ix));
    }
  }

  lookup(ix) {
    return this.program[ix] || 0;
  }

  lookupOffset(n) {
    return this.lookup(this.index + n);
  }

  input(param) {
    while (!this.waiting) this.next();
    this.next(param);
    return this;
  }

  runToNextOutput(param) {
    this.paused = false;
    while (!this.paused) this.next(param);
    return this;
  }

  runToIO() {
    this.paused = false;
    while (!this.paused && !this.waiting) this.next();
    return this;
  }

  run(param) {
    while (!this.terminated) this.next(param);
    return this;
  }

  reset() {
    this.program = this.originalProgram.slice(0);
    this.index = 0;
    this.terminated = false;
    this.relativeBase = 0;
    this.paused = false;
    this.output = undefined;
    this.outArray = [];
    return this;
  }

  override(ix, value) {
    this.program[ix] = value;
    return this;
  }
}
