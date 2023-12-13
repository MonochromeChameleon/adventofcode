import { QuestionBase } from '../../utils/question-base.js';
import { countBy } from '../../utils/count-by-value.js';

export class Question extends QuestionBase {
  constructor() {
    super(2023, 7, 252295678, 250577259);

    this.exampleInput({ part1: 6440, part2: 5905 });
  }

  parseCard(card) {
    if (card === 'A') return 14;
    if (card === 'K') return 13;
    if (card === 'Q') return 12;
    if (card === 'J') return 11;
    if (card === 'T') return 10;
    return Number(card);
  }

  parseLine(line) {
    const [hand, bid] = line.split(' ');
    return { cards: hand.split('').map(this.parseCard), bid: Number(bid) };
  }

  categorizeHand(cards) {
    const { 1: js = 0, ...grouped } = countBy(cards, (it) => it);
    const [first = 0, second = 0] = Object.values(grouped).sort((a, b) => b - a);
    if (first + js === 5) return 6;
    if (first + js === 4) return 5;
    if (first + js === 3) return second === 2 ? 4 : 3;
    if (first + js === 2) return second === 2 ? 2 : 1;
    return 0;
  }

  compareCards([a, ...aa], [b, ...bb]) {
    return a - b || this.compareCards(aa, bb);
  }

  compareHands({ cards: a }, { cards: b }) {
    return this.categorizeHand(a) - this.categorizeHand(b) || this.compareCards(a, b);
  }

  part1(input) {
    return input.sort(this.compareHands.bind(this)).reduce((a, { bid }, ix) => a + bid * (ix + 1), 0);
  }

  part2(input) {
    return input
      .map(({ cards, bid }) => ({ bid, cards: cards.map((c) => (c === 11 ? 1 : c)) }))
      .sort(this.compareHands.bind(this))
      .reduce((a, { bid }, ix) => a + bid * (ix + 1), 0);
  }
}
