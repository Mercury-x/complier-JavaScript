import {
  TYPE
} from "../symbols/Type";
import {
  Stmt
} from "./stmt";

export default class Else extends Stmt {
  constructor(x, s1, s2) {
    super()
    this.expr = x;
    this.stmt1 = s1;
    this.stmt2 = s2;
    if (this.expr.type != TYPE.Bool) {
      this.expr.error('boolean required in if');
    }
  }

  gen = (b, a) => {
    const label1 = this.newlabel();
    const label2 = this.newlabel();
    this.expr.jumping(0, label2);
    this.emitlabel(label1)
    this.stmt1.gen(label1, a);
    this.emit('goto L' + a);
    this.emitlabel(label2)
    this.stmt2.gen(label2, a);
  }
}