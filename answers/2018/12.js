import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2018, 12, 3230, 4400000000304);

    this.exampleInput({ part1: 325 });
  }

  get parser() {
    return Parsers.MULTIPLE;
  }

  get parsers() {
    return {
      initialState: Parsers.SINGLE_LINE.withMappedProps({ parseLine: 'parseInitialState' }),
      rules: Parsers.PARSER,
    };
  }

  parserGroup(line) {
    return /^initial state:/.test(line) ? 'initialState' : 'rules';
  }

  parseInitialState(line) {
    return line.replace(/^initial state: /, '');
  }

  parseLine(line) {
    const [from, to] = line.split(' => ');
    return { from, to };
  }

  generation({ state, lix, rules }) {
    const extendedState = `....${state}....`;
    const nextState = Array.from({ length: state.length + 4 }, (_, i) => {
      const pattern = extendedState.substr(i, 5);
      const rule = rules.find(({ from }) => from === pattern);
      return rule?.to || '.';
    });

    const newState = nextState.join('');
    const offset = newState.indexOf('#');
    const end = newState.lastIndexOf('#');

    const miniState = newState.substr(offset, end - offset + 1);

    return { state: miniState, lix: lix + offset - 2 };
  }

  part1({ initialState, rules }) {
    const { state, lix } = Array.from({ length: 20 }).reduce(
      (s) =>
        this.generation({
          ...s,
          rules,
        }),
      { state: initialState, lix: 0 },
    );

    return state.split('').reduce((sum, c, i) => (c === '.' ? sum : sum + i + lix), 0);
  }

  part2({ initialState, rules }) {
    const states = [];
    let state = initialState;
    let lix = 0;
    while (!states.includes(state)) {
      states.push(state);
      ({ state, lix } = this.generation({ state, lix, rules }));
    }

    const finalLix = lix + (50000000000 - states.length);

    return state.split('').reduce((sum, c, i) => (c === '.' ? sum : sum + i + finalLix), 0);
  }
}
