export class Tree {
  constructor(data, parent = undefined) {
    this.data = data;
    this.parent = parent;
    this.children = [];
  }

  add(data) {
    const child = new Tree(data, this);
    this.children.push(child);
    return child;
  }

  get root() {
    if (this.parent) return this.parent.root;
    return this;
  }

  get maxLength() {
    return this.data.length + this.children.reduce((acc, child) => Math.max(acc, child.maxLength), 0);
  }

  get minLength() {
    return this.data.length + this.children.reduce((acc, child) => Math.min(acc, child.minLength), 0);
  }
}
