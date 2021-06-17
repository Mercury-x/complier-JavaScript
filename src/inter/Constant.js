import {
  WORD,
  Word
} from "../lexer/Word";
import {
  TYPE
} from "../symbols/Type";
import Expr from "./Expr";

export class Constant extends Expr {
  constructor(tok, p) {
    if (tok instanceof Word) {
      super(tok, p);
    } else {
      super(Number(tok), TYPE.Int);
    }
  }

  jumping = (t, f) => {
    if (this == CTrue && t != 0) this.emit('goto L' + t);
    else if (this == CFalse && f != 0) this.emit('goto L' + f);
  }
}

export const CTrue = new Constant(WORD.True, TYPE.Bool, TYPE.Bool)
export const CFalse = new Constant(WORD.False, TYPE.Bool, TYPE.Bool)