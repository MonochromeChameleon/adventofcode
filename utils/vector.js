export class Vector {
  constructor(x, y, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(other) {
    return new Vector(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  equals(other) {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  get manhattan() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }
}

Vector.fromString = (coordinates) => new Vector(...coordinates.split(',').map(Number));
