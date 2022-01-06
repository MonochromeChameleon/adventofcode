import { QuestionBase } from '../../utils/question-base.js';

class Cave {
  constructor(name, links) {
    this.name = name;
    this.links = links;
    this.multivisit = /[A-Z]/.test(name);
  }

  paths({ caves, visited = [], canRepeat = false }) {
    if (this.name === 'end') {
      return [...visited, this.name];
    }
    return this.links
      .filter((it) => caves[it].multivisit || !visited.includes(it) || canRepeat)
      .flatMap((link) => {
        const next = caves[link];
        const canStillRepeat = canRepeat && (next.multivisit || !visited.includes(link));
        return next.paths({ caves, visited: [...visited, this.name], canRepeat: canStillRepeat });
      });
  }
}

export class Question extends QuestionBase {
  constructor(args) {
    super(2021, 12, 226, 5157, 3509, 144309, args);
  }

  parseLine(line) {
    const [a, b] = line.split('-');
    return [
      [a, b],
      [b, a],
    ];
  }

  parseInput(lines) {
    const groups = lines
      .flatMap(this.parseLine)
      .filter((it) => it[1] !== 'start' && it[0] !== 'end')
      .reduce((g, [start, end]) => {
        g[start] = g[start] || [];
        g[start].push(end);
        return g;
      }, {});

    return Object.keys(groups)
      .map((name) => new Cave(name, groups[name]))
      .reduce(
        (caves, it) => {
          caves[it.name] = it;
          return caves;
        },
        { end: new Cave('end', []) }
      );
  }

  part1(caves) {
    const paths = caves.start.paths({ caves });
    return paths.filter((it) => it === 'end').length;
  }

  part2(caves) {
    const paths = caves.start.paths({ caves, canRepeat: true });
    return paths.filter((it) => it === 'end').length;
  }
}
