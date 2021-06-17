import Array from "../symbols/Array";
import {
  TYPE2
} from "../symbols/Type";
import {
  Stmt
} from "./stmt";

export default class SetElem extends Stmt {
  constructor(x, y) {
    super();
    // console.log(y)
    this.array = x.array;
    this.index = x.index;
    this.expr = y;
    // console.log('setEmelem')
    // console.log(x.type, y.type)
    // console.log(TYPE2.numeric(x.type) && TYPE2.numeric(y.type))
    if (this.check(x.type, y.type) == null) this.error('type error');
  }

  check = (p1, p2) => {
    if (p1 instanceof Array || p2 instanceof Array) return null;
    else if (p1 == p2) return p2;
    else if (TYPE2.numeric(p1) && TYPE2.numeric(p2)) return p2;
    else return null;
  }

  gen = () => {
    let s1 = this.index.reduce().toString();
    let s2 = this.expr.reduce().toString();
    this.emit(this.array.toString() + '[ ' + s1 + ' ] = ' + s2);
  }
}