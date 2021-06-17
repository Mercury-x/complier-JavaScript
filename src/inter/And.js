import Logical from "./Logical";

export default class And extends Logical {
  constructor(tok, x1, x2) {
    super(tok, x1, x2);
  }

  jumping = (t, f) => {
    const label = f != 0 ? f : this.newlabel();
    this.expr1.jumping(0, label);
    this.expr2.jumping(t, f);
    if (f == 0)
      this.emitlabel(label);
  }
}