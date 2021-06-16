import Tag from "../lexer/Tag";
import {
  Type
} from "./Type";

export default class Array extends Type {
  constructor(sz, p) {
    super("[]", Tag.INDEX, sz * p.width);
    this.size = sz;
    this.of = p;
  }

  toString = () => {
    return `[${this.size}]${this.of.toString()}`
  }
}