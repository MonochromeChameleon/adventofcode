import { Parser } from './parser.js';

export class MultiplePatternsParser extends Parser {
  parseInput(lines) {
    const lineGroups = lines.reduce((groups, line) => {
      const g = this.parserGroup(line);
      const { [g]: group = [] } = groups;
      return { ...groups, [g]: [...group, line] };
    }, {});

    return Object.fromEntries(
      Object.entries(lineGroups).map(([group, ls]) => {
        const parser = this.parsers[group];
        return [group, parser.parseInput.call(this, ls)];
      })
    );
  }
}
