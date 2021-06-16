import {
  TYPE
} from "../symbols/Type";
import {
  Stmt
} from "./stmt";

export default class IF extends Stmt {
  constructor(x, s) {
    super();
    this.expr = x;
    this.stmt = s;
    if (this.expr.type != TYPE.Bool) {
      this.expr.error('boolean required in if');
    }
  }

  gen = (b, a) => {
    const label = this.newlabel();
    this.expr.jumping(0, a);
    this.emitlabel(label);
    this.stmt.gen(label, a);
  }
}