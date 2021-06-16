import {
  TYPE
} from '../symbols/Type';
import {
  Stmt
} from './stmt';

export default class Do extends Stmt {
  constructor() {
    super();
    this.expr = null;
    this.stmt = null;
  }

  init = (s, x) => {
    this.expr = x;
    this.stmt = s;
    if (this.expr.type != TYPE.Bool) {
      this.expr.error("boolean required in do");
    }
  }

  gen(b, a) {
    this.after = a;
    label = this.newlabel();
    this.stmt.gen(b, label);
    this.emitlabel(label);
    this.expr.jumping(b, 0);
  }
}