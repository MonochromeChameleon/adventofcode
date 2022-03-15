export class Vector {
  constructor(x, y, z = null) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(other) {
    if (this.z === null) {
      return new Vector(this.x + other.x, this.y + other.y, other.z);
    }
    return new Vector(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  subtract(other) {
    if (this.z === null) {
      return new Vector(this.x - other.x, this.y - other.y, other.z);
    }
    return new Vector(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  equals(other) {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  get manhattan() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z || 0);
  }

  toString() {
    if (this.z === null) {
      return `(${this.x}, ${this.y})`;
    }
    return `(${this.x}, ${this.y}, ${this.z})`;
  }
}

Vector.fromString = (coordinates) => new Vector(...coordinates.split(',').map(Number));
