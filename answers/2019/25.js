import { IntcodeQuestion } from './intcode/intcode-question.js';

const COMMANDS = [
  // == Hull Breach == N W
  'west', // == Stables == N (E)
  'take mouse',
  'north', // == Sick Bay == (S) W
  'west', // == Arcade == N (E) W
  'north', // == Navigation == N E (S)
  'north', // == Observatory == (S) W
  'west', // == Holodeck == N (E) W
  'north', // == Gift Wrapping Center == (S)
  'take wreath',
  'south', // == Holodeck == (N) (E) (W)
  'east', // == Observatory == (S) (W)
  'south', // == Navigation == (N) E (S)
  'east', // == Hot Chocolate Fountain == N (S) (W)
  'take hypercube',
  'north', // == Crew Quarters == E (S)
  'east', // == Storage == (W)
  'take prime number',
  'west', // == Crew Quarters == (E) S
  'south', // == Hot Chocolate Fountain == (N) (S) (W)
  'west', // == Navigation == (N) (E) (S)
  'south', // == Arcade == (N) (E) W
  'west', // == Warp Drive Maintenance == (E) W
  'west', // == Security Checkpoint == N (E)
  'north',
];

export class Question extends IntcodeQuestion {
  constructor() {
    super(2019, 25, 18874497);
  }

  sendInput(intcode, command) {
    command
      .split('')
      .map((c) => c.charCodeAt(0))
      .forEach((c) => intcode.input(c));
    intcode.input(10);
    intcode.outArray = [];
    return intcode;
  }

  async execute(intcode, cmdix) {
    while (!intcode.waiting && !intcode.terminated) intcode.next();
    if (intcode.terminated) return;
    return this.sendInput(intcode, COMMANDS[cmdix]);
    // Interactive version
    /**
      const FORBIDDEN_COMMANDS = [
        'take photons',
        'take molten lava',
        'take giant electromagnet',
        'take escape pod',
        'take infinite loop',
      ];

      return new Promise((resolve, reject) => {
        prompt.get(
          {
            name: 'command',
            description: intcode.outArray.map((c) => String.fromCharCode(c)).join(''),
          },
          (err, result) => {
            if (err) reject(err);
            if (FORBIDDEN_COMMANDS.includes(result.command)) {
              console.log('You know that is not a good idea'); // eslint-disable-line no-console
              return resolve(intcode);
            }
            resolve(this.sendInput(intcode, result.command));
          }
        );
      });
    */
  }

  async part1(intcode) {
    let i = 0;
    while (!intcode.terminated) {
      await this.execute(intcode, i); // eslint-disable-line no-await-in-loop
      i += 1;
    }
    return Number(
      intcode.outArray
        .map((c) => String.fromCharCode(c))
        .join('')
        .replace(/[^\d]/g, '')
    );
  }
}
