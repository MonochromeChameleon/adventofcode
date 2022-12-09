import { QuestionBase, Parsers } from '../../utils/question-base.js';

class File {
  constructor(name, size) {
    this.name = name;
    this.size = size;
    this.type = 'file';
  }
}
class Directory {
  constructor(name) {
    this.name = name;
    this.contents = {};
    this.type = 'dir';
  }

  get size() {
    return Object.values(this.contents).map((c) => c.size).reduce((a, b) => a + b, 0);
  }

  addFile(name, size) {
    this.contents[name] = size ? new File(name, size) : new Directory(name);
  }

  get allDirectories() {
    const localDirs = Object.values(this.contents).filter(({ type }) => type === 'dir');
    const nestedDirs = localDirs.flatMap((d) => d.allDirectories);
    return [...localDirs, ...nestedDirs];
  }
}

class Filesystem extends Directory {
  constructor(props) {
    super('/')
    this.path = [];
  }

  addFileAtPath(name, size) {
    const dir = this.path.reduce((d, p) => d.contents[p], this);
    dir.addFile(name, size);
  }

  addLine(line) {
    const parts = line.split(' ');
    switch (parts[0]) {
      case '$':
        switch (parts[1]) {
          case 'cd':
            switch (parts[2]) {
              case '/':
                this.path = [];
                break;
              case '..':
                this.path.pop();
                break;
              default:
                this.path.push(parts[2]);
            }
            break;
          default:
            break;
        }
        break;
      case 'dir':
        this.addFileAtPath(parts[1]);
        break;
      default:
        this.addFileAtPath(parts[1], Number(parts[0]));
    }
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2022, 7, 1297683, 5756764);

    this.exampleInput({ filename: '7a', part1: 95437, part2: 24933642 });
  }

  get parser() {
    return Parsers.REDUCE;
  }

  get reducer() {
    return Filesystem;
  }

  part1(fs, maxSize = 100000) {
    const dirs = fs.allDirectories;
    const sizes = dirs.map(({ size }) => size);
    return sizes.filter((sz) => sz < maxSize).reduce((a, b) => a + b, 0);
  }

  part2(fs, totalSize = 70000000, freeSpaceReq = 30000000) {
    const freeSpace = totalSize - fs.size;
    const amtToFree = freeSpaceReq - freeSpace;
    const dirs = fs.allDirectories.filter(({ size }) => size > amtToFree).sort((a, b) => a.size - b.size);
    return dirs[0].size;
  }
}
