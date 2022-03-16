import { QuestionBase } from '../../utils/question-base.js';
import { groupBy } from '../../utils/count-by-value.js';
import { binaryChop } from '../../utils/binary-chop.js';

class BattleGroup {
  constructor({ ix, type, units, hitpoints, immune, weak, damage, attackType, initiative }) {
    this.ix = ix;
    this.type = type;
    this.units = units;
    this.hitpoints = hitpoints;
    this.immune = immune;
    this.weak = weak;
    this.damage = damage;
    this.attackType = attackType;
    this.initiative = initiative;
  }

  boost(boost) {
    if (this.type === 'Immune System') {
      this.damage += boost;
    }
    return this;
  }

  get effectivePower() {
    return this.units * this.damage;
  }

  getMultiplier(defender) {
    if (defender.immune.includes(this.attackType)) return 0;
    if (defender.weak.includes(this.attackType)) return 2;
    return 1;
  }

  calculateDamage(defender) {
    return this.getMultiplier(defender) * this.effectivePower;
  }

  cmpSelectTarget(other) {
    return other.effectivePower - this.effectivePower || other.initiative - this.initiative;
  }

  cmpAttack(other) {
    return other.initiative - this.initiative;
  }

  selectTarget(groups, alreadySelected) {
    const selectedInits = alreadySelected.map(({ target: { initiative } }) => initiative);
    const tgt = groups
      .filter((g) => g.type !== this.type && !selectedInits.includes(g.initiative))
      .reduce((best, g) => {
        const thisDamage = this.calculateDamage(g);
        if (!thisDamage) return best;

        const bestDamage = best ? this.calculateDamage(best) : 0;
        if (thisDamage < bestDamage) return best;
        if (thisDamage > bestDamage) return g;
        return best;
      }, undefined);

    if (tgt) return [...alreadySelected, { attacker: this, target: tgt }];

    return alreadySelected;
  }

  attack(defender) {
    const damage = this.calculateDamage(defender);
    const unitsKilled = ~~(damage / defender.hitpoints);
    defender.units = Math.max(0, defender.units - unitsKilled);
    return !!unitsKilled;
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2018, 24, 26937, 4893);

    this.exampleInput({ part1: 5216, part2: 51 });
  }

  parseLine(line, type, ix) {
    if (line.endsWith(':')) return line.replace(/:$/, '');

    const [, units, hitpoints, immunoweak, damage, attackType, initiative] =
      /^(\d+) units each with (\d+) hit points \(?([^)]*)\)?\s?with an attack that does (\d+) (\w+) damage at initiative (\d+)/
        .exec(line)
        .map((v) => (Number.isNaN(Number(v)) ? v : Number(v)));
    const immune = !immunoweak
      ? []
      : (
          immunoweak
            .split(';')
            .map((it) => it.trim())
            .find((it) => it.startsWith('immune')) || ''
        )
          .replace(/^immune to /, '')
          .split(',')
          .map((it) => it.trim())
          .filter(Boolean);
    const weak = !immunoweak
      ? []
      : (
          immunoweak
            .split(';')
            .map((it) => it.trim())
            .find((it) => it.startsWith('weak')) || ''
        )
          .replace(/^weak to /, '')
          .split(',')
          .map((it) => it.trim())
          .filter(Boolean);

    return {
      ix,
      type,
      units,
      hitpoints,
      immune,
      weak,
      damage,
      attackType,
      initiative,
      effectivePower: damage * units,
    };
  }

  parseInput(lines) {
    return lines.reduce(
      ({ type, groups, ix }, line) => {
        const parsed = this.parseLine(line, type, ix + 1);
        if (typeof parsed === 'string') {
          return { type: parsed, groups, ix: 0 };
        }
        return { type, groups: [...groups, parsed], ix: ix + 1 };
      },
      { type: undefined, groups: [], ix: 0 }
    ).groups;
  }

  isBattleOver(groups) {
    return Object.keys(groupBy(groups, ({ type }) => type)).length === 1;
  }

  selectTarget(groups) {
    return groups.sort((a, b) => a.cmpSelectTarget(b)).reduce((selected, g) => g.selectTarget(groups, selected), []);
  }

  battle(groups) {
    while (!this.isBattleOver(groups)) {
      let stalemate = true;
      const targets = this.selectTarget(groups).sort((a, b) => a.attacker.cmpAttack(b.attacker));

      targets.forEach(({ attacker, target }) => {
        const unitsKilled = attacker.attack(target);
        if (unitsKilled) {
          stalemate = false;
        }
      });

      if (stalemate) return true;
      groups = groups.filter(({ units }) => units > 0);
    }
    return false;
  }

  part1(input) {
    const groups = input.map((inp) => new BattleGroup(inp));
    this.battle(groups);

    return groups.reduce((sum, group) => sum + group.units, 0);
  }

  part2(input) {
    const boost = binaryChop(10, (b) => {
      const groups = input.map((inp) => new BattleGroup(inp).boost(b));
      const stalemate = this.battle(groups);
      return !stalemate && groups.find(({ units }) => units > 0).type === 'Immune System';
    });

    const groups = input.map((inp) => new BattleGroup(inp).boost(boost));
    this.battle(groups);

    return groups.reduce((sum, group) => sum + group.units, 0);
  }
}
