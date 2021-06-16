import {
  TYPE,
  TYPE2
} from '../symbols/Type';
import {
  Stmt
} from './stmt';

export default class Set extends Stmt {
  constructor(i, x) {
    super();
    this.id = i;
    this.expr = x;
    console.log('#in Set.js# expr#####')
    console.log(x)
    if (this.check(this.id.type, this.expr.type) == null)
      this.error("type error");
  }

  check = (p1, p2) => {
    console.log('######in Set.js######')
    console.log(p1, p2)
    console.log(TYPE2.numeric(p1), TYPE2.numeric(p2))
    if (TYPE2.numeric(p1) && TYPE2.numeric(p2)) {
      return p2;
    } else if (p1 == TYPE.Bool && TYPE.Bool == p2) {
      return p2;
    } else {
      return null;
    }
  }

  gen = (b, a) => {
    this.emit(this.id.toString() + ' = ' + this.expr.gen().toString());
  }
}