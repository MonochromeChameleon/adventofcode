import { QuestionBase, Parsers } from '../../utils/question-base.js';

class Item {
  constructor(name, cost, damage, armor) {
    this.name = name;
    this.cost = cost;
    this.damage = damage;
    this.armor = armor;
  }
}

class Shop {
  constructor(weapons, armor, rings) {
    this.weapons = weapons;
    this.armor = armor;
    this.rings = rings;
  }

  get options() {
    if (!this._options) {
      this._options = this.weapons
        .flatMap((weapon) =>
          this.armor.flatMap((armor) =>
            this.rings.flatMap((r1, ix) =>
              this.rings.slice(ix + 1).map((r2) => ({
                weapon,
                armor,
                rings: [r1, r2],
                cost: [weapon, armor, r1, r2].reduce((sum, { cost }) => sum + cost, 0),
              }))
            )
          )
        )
        .sort((a, b) => a.cost - b.cost);
    }
    return this._options;
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2015, 21, 111, 188);

    const weapons = [
      new Item('Dagger', 8, 4, 0),
      new Item('Shortsword', 10, 5, 0),
      new Item('Warhammer', 25, 6, 0),
      new Item('Longsword', 40, 7, 0),
      new Item('Greataxe', 74, 8, 0),
    ];

    const armor = [
      new Item('None', 0, 0, 0),
      new Item('Leather', 13, 0, 1),
      new Item('Chainmail', 31, 0, 2),
      new Item('Splintmail', 53, 0, 3),
      new Item('Bandedmail', 75, 0, 4),
      new Item('Platemail', 102, 0, 5),
    ];

    const rings = [
      new Item('None', 0, 0, 0),
      new Item('None', 0, 0, 0),
      new Item('Damage +1', 25, 1, 0),
      new Item('Damage +2', 50, 2, 0),
      new Item('Damage +3', 100, 3, 0),
      new Item('Defense +1', 20, 0, 1),
      new Item('Defense +2', 40, 0, 2),
      new Item('Defense +3', 80, 0, 3),
    ];

    this.shop = new Shop(weapons, armor, rings);
  }

  get parser() {
    return Parsers.PROPERTY_LIST;
  }

  player(hitPoints, { weapon, armor, rings }) {
    return {
      hitPoints,
      damage: [weapon, ...rings].reduce((sum, { damage }) => sum + damage, 0),
      armor: [armor, ...rings].reduce((sum, { armor }) => sum + armor, 0),
    };
  }

  willWin(player, boss) {
    const playerDamagePerTurn = Math.max(1, player.damage - boss.armor);
    const bossDamagePerTurn = Math.max(1, boss.damage - player.armor);

    const bossTurns = Math.ceil(player.hitPoints / bossDamagePerTurn);
    return playerDamagePerTurn * bossTurns > boss.hitPoints;
  }

  part1(boss) {
    const { cost } = this.shop.options.find((opt) => this.willWin(this.player(100, opt), boss));
    return cost;
  }

  part2(boss) {
    const { cost } = this.shop.options.reverse().find((opt) => !this.willWin(this.player(100, opt), boss));
    return cost;
  }
}
