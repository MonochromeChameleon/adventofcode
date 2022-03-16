export class Vector {
  constructor(...points) {
    this.points = points.flat(Infinity);
  }

  get x() {
    return this.points[0];
  }

  set x(value) {
    this.points[0] = value;
  }

  get y() {
    return this.points[1];
  }

  set y(value) {
    this.points[1] = value;
  }

  get z() {
    return this.points[2];
  }

  set z(value) {
    this.points[2] = value;
  }

  add(other) {
    const points = this.points.map((p, i) => p + other.points[i]);
    return new Vector(...points);
  }

  subtract(other) {
    const points = this.points.map((p, i) => p - other.points[i]);
    return new Vector(...points);
  }

  multiply(...others) {
    const points = others.map((other) => this.points.reduce((sum, p, i) => sum + p * other.points[i], 0));
    return new Vector(...points);
  }

  equals(other) {
    return this.points.every((p, i) => p === other.points[i]);
  }

  get manhattan() {
    return this.points.reduce((sum, p) => sum + Math.abs(p), 0);
  }

  toString() {
    return `(${this.points.join(', ')})`;
  }
}

Vector.fromString = (coordinates) => new Vector(...coordinates.split(',').map(Number));
