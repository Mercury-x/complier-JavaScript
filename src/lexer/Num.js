import Token from "./Token";
import Tag from "./Tag";

export default class Num extends Token {
  constructor(v) {
    super(Tag.NUM)
    this.value = v;
  }

  toString = () => {
    return `${this.value}`
  }
}