import Tag from "./Tag";
import Token from "./Token";

export default class Real extends Token {
  constructor(v) {
    super(Tag.REAL);
    this.value = v;
  }

  toString = () => {
    return `${this.value}`
  }
}