import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2018, 8, 40309, 28779);

    this.exampleInput({ input: '2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2', part1: 138, part2: 66 });
  }

  get parser() {
    return Parsers.SINGLE_LINE_DELIMITED_NUMBERS;
  }

  get split() {
    return ' ';
  }

  parseNodes(digits, count = 1) {
    return Array.from({ length: count }).reduce(
      ({ childNodes, remainder }) => {
        const [children, meta, ...rest] = remainder;
        if (!children) {
          const newChild = { childNodes: [], metaNodes: rest.slice(0, meta) };
          return { childNodes: [...childNodes, newChild], remainder: rest.slice(meta) };
        }
        const { childNodes: newChildren, remainder: newRemainder } = this.parseNodes(rest, children);
        const newChild = { childNodes: newChildren, metaNodes: newRemainder.slice(0, meta) };
        return { childNodes: [...childNodes, newChild], remainder: newRemainder.slice(meta) };
      },
      { childNodes: [], remainder: digits }
    );
  }

  postParse(digits) {
    return this.parseNodes(digits);
  }

  sumMeta(...nodes) {
    return nodes.reduce(
      (sum, node) => sum + node.metaNodes.reduce((x, n) => x + n, 0) + this.sumMeta(...node.childNodes),
      0
    );
  }

  getValue(node) {
    if (node.childNodes.length === 0) return node.metaNodes.reduce((x, n) => x + n, 0);
    return node.metaNodes
      .map((m) => node.childNodes[m - 1])
      .filter(Boolean)
      .map(this.getValue.bind(this))
      .reduce((sum, n) => sum + n, 0);
  }

  part1({ childNodes: [root] }) {
    return this.sumMeta(root);
  }

  part2({ childNodes: [root] }) {
    return this.getValue(root);
  }
}
