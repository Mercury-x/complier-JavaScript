import Logical from "./Logical";

export default class Not extends Logical {
  constructor(tok, x2) {
    super(tok, x2, x2);
  }

  jumping = (t, f) => {
    this.expr2.jumping(f, t);
  }

  toString = () => {
    return this.op.toString() + ' ' + this.expr2.toString();
  }
}