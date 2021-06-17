import Tag from "../lexer/Tag";
import {
  Word,
  WORD
} from "../lexer/Word";

export class Type extends Word {
  width = 0;

  constructor(s, Tag, w) {
    super(s, Tag);
    this.width = w;
  }

  numeric = (p) => {
    // console.log(p)
    if (p.tag == TYPE.Char.tag || p.tag == TYPE.Int.tag || p.tag == TYPE.Float.tag) return true;
    else return false
  }

  max(p1, p2) {
    if (!this.numeric(p1) || !this.numeric(p2)) return null;
    else if (p1 == TYPE.Float || p2 == TYPE.Float) return TYPE.Float;
    else if (p1 == TYPE.Int || p2 == TYPE.Int) return TYPE.Int;
    else return TYPE.Char;
  }
}

export const TYPE = {
  Int: new Type("int", Tag.BASIC, 4),
  Float: new Type("float", Tag.BASIC, 8),
  Char: new Type("char", Tag.BASIC, 1),
  Bool: new Type("bool", Tag.BASIC, 1),
}

export const TYPE2 = new Type();