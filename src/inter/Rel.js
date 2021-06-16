import Array from "../symbols/Array";
import {
  TYPE,
  TYPE2
} from "../symbols/Type";
import Logical from "./Logical";

export default class Rel extends Logical {
  constructor(tok, x1, x2) {
    super(tok, x1, x2);
  }

  check(p1, p2) {
    console.log('in REL:')
    console.log(p1)
    if (p1 instanceof Array || p2 instanceof Array) return null;
    else if (TYPE2.numeric(p1) && TYPE2.numeric(p2)) return TYPE.Bool;
    else if (p1 == p2) return TYPE.Bool;
    else return null;
  }

  jumping = (t, f) => {
    let a = this.expr1.reduce();
    let b = this.expr2.reduce();
    const test = a.toString() + " " + this.op.toString() + " " + b.toString();
    this.emitjumps(test, t, f);
  }
}