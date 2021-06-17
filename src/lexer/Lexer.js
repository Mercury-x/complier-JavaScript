import {
  TYPE
} from "../symbols/Type";
import {
  getNextCh,
  isNumber,
  isLetter,
  isLetterOrDigit
} from "../tool/tool";
import {
  Word,
  WORD
} from "./Word";
import Tag from "./Tag";
import Token from "./Token";
import Real from "./Real";
import Num from "./Num";

export let line = 1;

export class Lexer {
  peek = " ";
  chIndex = 0; // 读取字符下标
  words = {} // hashTable

  constructor() {
    this.words.if = Tag.IF;
    this.words.else = Tag.ELSE;
    this.words.while = Tag.WHILE;
    this.words.do = Tag.DO;
    this.words.for = Tag.FOR;
    this.words.break = Tag.BREAK;
    this.words.continue = Tag.CONTINUE;
    this.words.true = Tag.TRUE;
    this.words.false = Tag.FALSE;
    this.words.int = TYPE.Int.tag;
    this.words.char = TYPE.Char.tag;
    this.words.bool = TYPE.Bool.tag;
    this.words.float = TYPE.Float.tag;
  }

  /**
   * 读取下一个字符
   */
  readch2 = () => {
    this.peek = getNextCh();
  }
  readch = (c) => {
    this.readch2();
    if (this.peek != c) return false;
    this.peek = ' ';
    return true;
  }

  scan = () => {
    for (;; this.readch2()) {
      if (this.peek == ' ' || this.peek == '\t') continue;
      else if (this.peek == '\n') line = line + 1;
      else break;
    }


    switch (this.peek) {
      case '&':
        if (this.readch('&')) return WORD.and;
        else return new Token('&');
      case '|':
        if (this.readch('|')) return WORD.or;
        else return new Token('|');
      case '=':
        if (this.readch('=')) return WORD.eq;
        else return new Token('=');
      case '!':
        if (this.readch('=')) return WORD.ne;
        else return new Token('!');
      case '<':
        if (this.readch('=')) return WORD.le;
        else return new Token('<');
      case '>':
        if (this.readch('=')) return WORD.ge;
        else return new Token('>');
    }
    if (isNumber(this.peek) || this.peek == '.') {
      let v = 0;
      if (this.peek != '.') {
        do {
          v = 10 * v + Number(this.peek);
          this.readch2();
        } while (isNumber(this.peek))
      }
      if (this.peek != '.') return new Num(v);
      // console.log('final v: ' + typeof v, v);

      let x = v;
      let d = 10;
      for (;;) {
        this.readch2();
        if (!isNumber(this.peek)) break;
        x = x + Number(this.peek) / d;
        d = d * 10;
      }
      return new Real(x);
    }

    if (isLetter(this.peek) || this.peek == '_') {
      let b = '';
      do {
        b += this.peek;
        this.readch2();
        if (this.peek == undefined) break;
      } while (isLetterOrDigit(this.peek) || this.peek == '_');
      let w = this.words[b];
      if (w != null) return new Word(b, this.words[b]);
      w = new Word(b, Tag.ID);
      this.words[b] = Tag.ID;
      return w;
    }
    // console.log('peek:' + this.peek);
    let tok = new Token(this.peek)
    this.peek = " ";
    // console.log(tok)
    return tok;
  }
}