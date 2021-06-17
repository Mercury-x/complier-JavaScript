import Tag from "../lexer/Tag";
import {
  Word
} from "../lexer/Word";
import Op from "./Op";

// 表示数组访问的子类
export default class Access extends Op {
  constructor(a, i, p) {
    // console.log('in access')
    // console.log(p)
    super(new Word("[]", Tag.INDEX), p);
    this.array = a;
    this.index = i;
  }

  gen = () => {
    return new Access(this.array, this.index.reduce(), this.type);
  }


  jumping = (t, f) => {
    this.emitjumps(this.reduce().toString(), t, f);
  }

  toString = () => {
    return this.array.toString() + '[' + this.index.toString() + ']';
  }
}