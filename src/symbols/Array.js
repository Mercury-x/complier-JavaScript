import Tag from "../lexer/Tag";
import {
  Type
} from "./Type";

/**
 * @param {Type} of - 数组下标的类型
 */
export default class Array extends Type {
  constructor(sz, p) {
    super("[]", Tag.INDEX, sz * p.width); //  * p.width
    this.size = sz;
    this.of = p;
  }

  toString = () => {
    return `[${this.size}]${this.of.toString()}`
  }
}