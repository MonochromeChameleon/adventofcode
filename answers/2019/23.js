import { IntcodeQuestion } from './intcode/intcode-question.js';

export class Question extends IntcodeQuestion {
  constructor() {
    super(2019, 23, 16660, 11504);
  }

  provideInputs(computers, messages) {
    computers.filter(({ waiting }) => waiting).forEach(computer => {
      const message = messages[computer.id].shift();
      (message ? [message.x, message.y] : [-1]).forEach(v => computer.input(v));
      computer.runToIO();
    });
  }

  getOutputs(computers, messages) {
    computers.filter(({ paused }) => paused).forEach(computer => {
      const destination = computer.output;
      const { output: x } = computer.runToNextOutput();
      const { output: y } = computer.runToNextOutput();

      if (destination === 255) {
        messages[destination] = { x, y };
      } else {
        messages[destination].push({ x, y });
      }
      computer.runToIO();
    });
  }

  runAllComputers(computers, messages) {
    this.provideInputs(computers, messages);
    while (computers.filter(({ waiting }) => waiting).some(({ id }) => messages[id].length)) this.provideInputs(computers, messages);
    while (computers.some(({ paused }) => paused)) this.getOutputs(computers, messages);
  }

  newIntcode(id) {
    const i = super.newIntcode();
    i.id = id;
    return i.input(id).runToIO()
  }

  isIdle(computers, messages) {
    return computers.every(({ waiting, id }) => waiting && !messages[id].length);
  }

  part1() {
    const computers = Array.from({ length: 50 }, (_, i) => this.newIntcode(i));
    const messages = Object.fromEntries(Array.from({ length: 50 }, (_, i) => [i, []]));

    while (!messages[255]) this.runAllComputers(computers, messages);

    return messages[255].y;
  }

  part2(input) {
    const computers = Array.from({ length: 50 }, (_, i) => this.newIntcode(i));
    const messages = Object.fromEntries(Array.from({ length: 50 }, (_, i) => [i, []]));

    this.runAllComputers(computers, messages);

    const natMessages = [];
    let lastY = -1;
    while (!natMessages.includes(lastY)) {
      natMessages.push(lastY);
      while (!this.isIdle(computers, messages)) this.runAllComputers(computers, messages);
      const { x, y } = messages[255];
      computers[0].input(x).input(y).runToIO();
      lastY = y;
    }
    return lastY;
  }
}
