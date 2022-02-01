import { QuestionBase, Parsers } from '../../utils/question-base.js';

const MANA_COST = {
  MagicMissile: 53,
  Drain: 73,
  Shield: 113,
  Poison: 173,
  Recharge: 229,
};

const SPELL_DURATION = {
  MagicMissile: 1,
  Drain: 1,
  Shield: 6,
  Poison: 6,
  Recharge: 5,
};

const BLANK_SPELLS = {
  MagicMissile: 0,
  Drain: 0,
  Shield: 0,
  Poison: 0,
  Recharge: 0,
};

export class Question extends QuestionBase {
  constructor() {
    super(2015, 22, 900, 1216);

    this.exampleInput({ input: ['Hit Points: 13', 'Damage: 8'], part1: 226 }, { hitPoints: 10, mana: 250 });
  }

  get parser() {
    return Parsers.PROPERTY_LIST;
  }

  apply({ ...player }, { ...boss }, spell) {
    switch (spell) {
      case 'MagicMissile':
        boss.hitPoints -= 4;
        break;
      case 'Drain':
        boss.hitPoints -= 2;
        player.hitPoints += 2;
        break;
      case 'Shield':
        player.armor += 7;
        break;
      case 'Poison':
        boss.hitPoints -= 3;
        break;
      case 'Recharge':
        player.mana += 101;
        break;
    }

    return { p: player, b: boss };
  }

  applySpells({ ...player }, { ...boss }, { ...spells }) {
    player.armor = 0;
    const { p, b } = Object.entries(spells)
      .filter(([, v]) => v > 0)
      .map(([k]) => k)
      .reduce(({ p: pp, b: bb }, spell) => this.apply(pp, bb, spell), { p: player, b: boss });
    const s = Object.fromEntries(Object.entries(spells).map(([k, v]) => [k, Math.max(v - 1, 0)]));
    return { p, b, s };
  }

  playTurn(player, boss, mana = 0, spells = BLANK_SPELLS, castingHistory = [], wins = [Infinity]) {
    if (mana > wins[0]) return [];

    const availableSpells = Object.entries(spells)
      .filter(([k, v]) => v <= 1 && player.mana >= MANA_COST[k])
      .map(([k]) => k);

    if (!availableSpells.length) return [];

    return availableSpells.flatMap((s) => {
      const { p: p1, b: b1, s: s1 } = this.applySpells(player, boss, spells);
      if (b1.hitPoints <= 0) {
        if (mana < wins[0]) wins.unshift(mana);
        return { mana, spells: castingHistory };
      }
      p1.mana -= MANA_COST[s];
      s1[s] += SPELL_DURATION[s];

      const { p: p2, b: b2, s: s2 } = this.applySpells(p1, b1, s1);
      if (b2.hitPoints <= 0) {
        if (mana < wins[0]) wins.unshift(mana);
        return { mana: mana + MANA_COST[s], spells: [...castingHistory, s] };
      }

      p2.hitPoints -= Math.max(1, b2.damage - p2.armor);
      if (p2.hitPoints <= 0) return [];

      return this.playTurn(p2, b2, mana + MANA_COST[s], s2, [...castingHistory, s], wins);
    });
  }

  part1(boss, player = { hitPoints: 50, mana: 500 }) {
    const wins = this.playTurn(player, boss);
    return wins[wins.length - 1].mana;
  }

  part2(boss, player = { hitPoints: 50, mana: 500 }) {
    player.hitPoints -= 1;
    boss.damage += 1;
    const wins = this.playTurn(player, boss);
    return wins[wins.length - 1].mana;
  }
}
