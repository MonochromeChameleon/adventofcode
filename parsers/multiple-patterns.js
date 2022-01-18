import { Parser } from './parser.js';

export class MultiplePatternsParser extends Parser {
  parseInput(lines) {
    const lineGroups = lines.reduce((groups, line) => {
      const g = this.parserGroup(line);
      groups[g] = groups[g] || [];
      groups[g].push(line);
      return groups;
    }, {});

    return Object.fromEntries(Object.entries(lineGroups).map(([group, lines]) => {
      const parser = this.parsers[group];
      return [group, parser.parseInput.call(this, lines)];
    }));
  }
}
