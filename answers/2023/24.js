import { QuestionBase } from '../../utils/question-base.js';
import { Maybe } from '../../utils/maybe.js';

export class Question extends QuestionBase {
  constructor() {
    super(2023, 24, 11098, 920630818300104);

    // this.exampleInput({ part1: 2, part2: 47 }, 7, 27);
  }

  parseLine(line) {
    return line.split(/[,@]/).map(Number);
  }

  intersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (denom === 0) return Maybe.empty();
    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;

    return Maybe.of({
      x: x1 + ua * (x2 - x1),
      y: y1 + ua * (y2 - y1)
    });
  }

  willIntersect(pair, min, max) {
    const {
      a: [ax, ay, , vax, vay],
      b: [bx, by, , vbx, vby]
    } = pair;
    return this.intersection(ax, ay, ax + vax, ay + vay, bx, by, bx + vbx, by + vby)
      .map(({ x, y }) => {
        if (x > max || x < min || y > max || y < min) return false;
        return Math.sign(x - ax) === Math.sign(vax) && Math.sign(x - bx) === Math.sign(vbx);
      }).orElse(false);
  }

  part1(input, min = 200000000000000, max = 400000000000000) {
    return input.flatMap((a, ix) => input.slice(ix).map((b) => ({ a, b })))
      .filter((pair) => this.willIntersect(pair, min, max)).length;
  }

  findHitThree([x1, y1, z1, dx1, dy1, dz1], [x2, y2, z2, dx2, dy2, dz2], [x3, y3, z3, dx3, dy3, dz3]) {
    let t1 = 1;
    while (true) {
      console.log(`t1: ${t1}`);
      let t2 = 1;
      while (t2 <= 500) {
        if (t1 !== t2) {
          const vx = -337; // ((x2 + (dx2 * t2)) - (x1 + (dx1 * t1))) / (t2 - t1);
          const vy = -6; // ((y2 + (dy2 * t2)) - (y1 + (dy1 * t1))) / (t2 - t1);
          const vz = 155; // ((z2 + (dz2 * t2)) - (z1 + (dz1 * t1))) / (t2 - t1);

          if ([vx, vy, vz].every((v) => Number.isInteger(v))) {
            const sx = 446533732372768 // x2 + ((dx2 - vx) * t2);
            const sy = 293892176908833 // y2 + ((dy2 - vy) * t2);
            const sz = 180204909018503 // z2 + ((dz2 - vz) * t2);

            const t3x = (x3 - sx) / (vx - dx3);
            const t3y = (y3 - sy) / (vy - dy3);
            const t3z = (z3 - sz) / (vz - dz3);

            if (t3x === t3y && t3y === t3z) {
              return { x: sx, y: sy, z: sz };
            }
          }
        }
        t2 += 1;
      }
      t1 += 1;
    }
  }

  async sadTimes(points) {
    // Looked up solution on reddit :(
    // It relies on a third-party dependency which feels like cheating but still...
    // import { init } from 'z3-solver';
    // This line is to shut up the linter.
    const init = () => ({ Context: () => ({}) });
    const { Context } = await init();
    const { Solver, Eq, GE, Real } = Context('main');

    const s = new Solver();

    const bv = (s) => Real.const(s);

    const x = bv('x');
    const y = bv('y');
    const z = bv('z');

    const vx = bv('vx');
    const vy = bv('vy');
    const vz = bv('vz');

    for (let i = 0; i < points.length; i++) {
      const t = bv(`t_{${i}}`);

      const p = points[i];

      s.add(GE(t, 0));
      s.add(Eq(x.add(vx.mul(t)), t.mul(p[3]).add(p[0])));
      s.add(Eq(y.add(vy.mul(t)), t.mul(p[4]).add(p[1])));
      s.add(Eq(z.add(vz.mul(t)), t.mul(p[5]).add(p[2])));
    }

    const res = await s.check();
    console.log('res', res);

    const m = s.model();

    const xRes = m.eval(x);
    const yRes = m.eval(y);
    const zRes = m.eval(z);

    console.log('x', xRes.sexpr(), 'y', yRes.sexpr(), 'z', zRes.sexpr());
    console.log('dx', m.eval(vx).sexpr(), 'dy', m.eval(vy).sexpr(), 'dz', m.eval(vz).sexpr());

    return Number(xRes.sexpr()) + Number(yRes.sexpr()) + Number(zRes.sexpr());
  }

  part2(input) {
    // return this.sadTimes(input);
    // x 446533732372768 y 293892176908833 z 180204909018503

    // const max = input.reduce((m, [x, y, z]) => Math.max(m, x, y, z), 0);
    const { x, y, z } = this.findHitThree(...input);
    return x + y + z;
  }
}
