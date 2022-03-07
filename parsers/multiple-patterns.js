import { Parser } from './parser.js';

export class MultiplePatternsParser extends Parser {
  parseInput(lines) {
    const lineGroups = lines.reduce((groups, line, ix, lns) => {
      const g = this.m.parserGroup.call(this, line, ix, lns);
      const { [g]: group = [] } = groups;
      return { ...groups, [g]: [...group, line] };
    }, {});

    const input = Object.fromEntries(
      Object.entries(lineGroups).map(([group, ls]) => {
        const parser = this.m.parsers[group];
        this.mixout();
        parser.mixin(this);
        return [group, this.m.parseInput.call(this, ls)];
      })
    );
    this.parseInput = new MultiplePatternsParser().parseInput;
    return input;
  }
}
