import Token from "./Token";
import Tag from "./Tag";

export class Word extends Token {
  constructor(s, Tag) {
    super(Tag)
    this.lexeme = s;
  }

  toString = () => {
    return `${this.tag}`
  }

}


export const WORD = {
  and: new Word("&&", Tag.AND),
  or: new Word("||", Tag.OR),
  eq: new Word("==", Tag.EQ),
  ne: new Word("!=", Tag.NE),
  le: new Word("<=", Tag.LE),
  ge: new Word(">=", Tag.GE),
  minus: new Word("minus", Tag.MINUS),
  True: new Word("true", Tag.TRUE),
  False: new Word("false", Tag.FALSE),
  temp: new Word("t", Tag.TEMP),
};