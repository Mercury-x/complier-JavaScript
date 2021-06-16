import Access from "../inter/Access";
import {
  line
} from "../lexer/Lexer";
import Arith from "../inter/Arith";
import {
  CFalse,
  Constant,
  CTrue
} from "../inter/Constant";
import Do from "../inter/Do";
import Else from "../inter/Else";
import Id from "../inter/Id";
import IF from "../inter/If";
import Not from "../inter/Not";
import Or from "../inter/Or";
import Rel from "../inter/Rel";
import Seq from "../inter/Seq";
import Set from "../inter/Set";
import {
  Enclosing,
  stmtNull,
  updateStmtEnclousing
} from '../inter/stmt';
import Unary from "../inter/Unary";
import While from "../inter/While";
import Tag from "../lexer/Tag";
import {
  WORD
} from "../lexer/Word";
import Env from "../symbols/Env";
import And from "../inter/And";
import {
  TYPE
} from "../symbols/Type";
import SetElem from "../inter/SetElem";
import {
  nowChCode
} from "../tool/tool";
import Token from "../lexer/Token";
import Break from "../inter/Break";
import Continue from "../inter/Continue";


export default class Parser {
  used = 0;
  top = null; // env
  lex = null;
  look = null;

  constructor(lex) {
    this.lex = lex;
    this.move();
  }

  move = () => {
    this.look = this.lex.scan();
    // console.log('look', this.look)
  }

  error = (s) => {
    throw new Error(`near line ${line}: ${s}`);
    // console.log(`near line ${line}: ${s}`)
  }

  match = (t) => {
    console.log('match: ', this.look.tag, t)
    console.log('##########1')
    console.log(nowChCode())
    console.log('##########2')
    // console.log(this.look.tag, t, 'asdasd')
    if (this.look.tag === t) {
      this.move();
    } else {
      this.error("syntax error");
    }
  }

  program = () => {
    let s = this.block();
    // 生成中间代码////////////////
    console.log(s);
    const begin = s.newlabel();
    const after = s.newlabel();
    s.emitlabel(begin);
    s.gen(begin, after);
    s.emitlabel(after);
    /////////////////////////////
  }

  block = () => {
    this.match('{');
    const saveEnv = this.top;
    this.top = new Env(this.top);
    // console.log(this.top)
    let s = this.stmts();
    this.match('}');
    this.top = saveEnv;
    return s;
  }

  decls = () => {
    while (this.look.tag == Tag.BASIC) {
      // console.log('in decls')
      let p = this.type();
      while (true) {
        let tok = this.look;
        this.match(Tag.ID);
        let id = new Id(tok, p, this.used);

        // console.log('$$$$$$$$$$$$$$$$$$4')
        // console.log(tok)
        // console.log(this.top)
        if (this.top.table[tok.tag] == null) this.top.put(tok, id);
        else error("redefine of id " + tok.toString());

        this.used += p.width;
        if (this.look.tag == ';') {
          this.match(';');
          break;
        } else if (this.look.tag == '=') {
          this.match('=');
        } else {
          this.match(',');
        }
      }
    }
  }

  type = () => {
    const p = this.look;
    this.match(Tag.BASIC);
    if (this.look.tag != '[')
      return p;
    else
      return this.dims(p);
  }

  dims = (p) => {
    this.match('[');
    const tok = this.look;
    this.match(Tag.NUM);
    this.match(']');
    if (this.look.tag == '[') {
      p = this.dims(p);
    }
    return [tok, p];
  }

  stmt = () => {
    let x, s, s1, s2, savedStmt;
    switch (this.look.tag) {
      case ';':
        this.move();
        return stmtNull;
      case Tag.IF:
        this.match(Tag.IF);
        this.match('(');
        x = this.bool();
        this.match(')');
        s1 = this.stmt();
        if (this.look.tag != Tag.ELSE)
          return new IF(x, s1);
        this.match(Tag.ELSE);
        s2 = this.stmt();
        return new Else(x, s1, s2);
      case Tag.WHILE:
        const whilenode = new While();
        savedStmt = Enclosing;
        updateStmtEnclousing(whilenode);
        this.match(Tag.WHILE);
        this.match('(');
        x = this.bool();
        this.match(')');
        s1 = this.stmt();
        whilenode.init(x, s1);
        updateStmtEnclousing(savedStmt);
        // Enclosing = savedStmt;
        return whilenode;
      case Tag.DO:
        const donode = new Do();
        savedStmt = Enclosing;
        updateStmtEnclousing(donode);
        // Enclosing = donode;
        this.match(Tag.DO);
        s1 = this.stmt();
        this.match(Tag.WHILE);
        this.match('(');
        x = this.bool();
        this.match(')');
        this.match(';');
        donode.init(s1, x);
        updateStmtEnclousing(savedStmt);
        // Enclosing = savedStmt;
        return donode;
      case Tag.BREAK:
        this.match(Tag.BREAK);
        this.match(';');
        return new Break();
      case Tag.CONTINUE:
        this.match(Tag.CONTINUE);
        this.match(';');
        return new Continue();
      case '{':
        return this.block();
      default:
        return this.assign();
    }
  }

  stmts = () => {
    // console.log(this.look.tag, Tag.BASIC)
    if (this.look.tag === Tag.BASIC)
      this.decls();
    if (this.look.tag === '}')
      return stmtNull;
    else {
      return new Seq(this.stmt(), this.stmts());
    }
  }


  assign = () => {
    let stmt;
    let t = this.look;
    this.match(Tag.ID);
    // console.log('match sucess')
    let id = this.top.get(t);
    // console.log('id: ' + id)
    // console.log(this.top)
    if (id == null) {
      this.error(t.toString() + " undeclared");
      throw new Error(t.toString() + " undeclared")
    }
    if (this.look.tag == '=') {
      this.move();
      stmt = new Set(id, this.bool());
    } else {
      const x = this.offset(id);
      this.match('=');
      stmt = new SetElem(x, this.bool());
    }
    console.log(nowChCode())
    this.match(';');
    return stmt;
  }

  bool = () => {
    let x = this.join();
    while (this.look.tag == Tag.OR) {
      let tok = this.look;
      this.move();
      x = new Or(tok, x, this.join());
    }
    return x;
  }

  join = () => {
    let x = this.equality();
    while (this.look.tag == Tag.AND) {
      let tok = this.look;
      this.move();
      x = new And(tok, x, this.equality());
    }
    return x;
  }

  equality = () => {
    let x = this.rel();
    while (this.look.tag == Tag.EQ || this.look.tag == Tag.NE) {
      const tok = this.look;
      this.move();
      x = new Rel(tok, x, this.rel());
    }
    return x;
  }

  rel = () => {
    let x = this.expr();
    console.log('tag')
    console.log(this.look.tag)
    switch (this.look.tag) {
      case '<':
      case Tag.LE:
      case Tag.GE:
      case '>':
        const tok = this.look;
        this.move();
        return new Rel(tok, x, this.expr());
      default:
        return x;
    }
  }

  expr = () => {
    let x = this.term();
    while (this.look.tag == '+' || this.look.tag == '-') {
      const tok = this.look;
      this.move();
      x = new Arith(tok, x, this.term());
    }
    return x;
  }

  term = () => {
    let x = this.unary();
    while (this.look.tag == '*' || this.look.tag == '/') {
      const tok = this.look;
      this.move();
      x = new Arith(tok, x, this.unary());
    }
    return x;
  }

  unary = () => {
    if (this.look.tag == '-') {
      this.move();
      return new Unary(WORD.minus, this.unary());
    } else if (this.look.tag == '!') {
      const tok = this.look;
      this.move();
      return new Not(tok, this.unary());
    } else
      return this.factor();
  }

  factor = () => {
    let x = null;
    switch (this.look.tag) {
      case '(':
        this.move();
        x = this.bool();
        this.match(')');
        return x;
      case Tag.NUM:
        x = new Constant(this.look, TYPE.Int);
        this.move();
        return x;
      case Tag.REAL:
        x = new Constant(this.look, TYPE.Float);
        this.move();
        return x;
      case Tag.TRUE:
        x = CTrue;
        this.move();
        return x;
      case Tag.FALSE:
        x = CFalse;
        this.move();
        return x;
      case Tag.ID:
        let s = this.look.toString();
        let id = this.top.get(this.look);
        if (id == null)
          error(this.look.toString() + " undeclared");
        this.move();
        console.log(id)
        if (this.look.tag != '[')
          return id;
        else
          return this.offset(id);
      default:
        // console.log('look tag :' + this.look.tag)
        this.error("syntax error");
        return x;
    }
  }

  offset = (a) => {
    let i; // expr
    let w; // expr
    let t1, t2; // expr
    let loc; // expr
    let type = a.type;
    console.log(a)
    this.match('[');
    i = this.bool();
    this.match(']');
    try {
      // type = this.type.of;
    } catch (e) {
      // console.log(e);
      error("this object doesn't have so many dimensions");
    }
    w = new Constant(this.type.width);
    t1 = new Arith(new Token('*'), i, w);
    loc = t1;
    // console.log('isisisiisisisisiisisisisiisisisisiisisisisiisisisisiisisisisiisisisisiisisisisiisisisisiisisisisiisisisisiisisisisiisisisisiisisis')
    while (this.look.tag == '[') {
      this.match('[');
      i = this.bool();
      this.match(']');
      try {
        // type = this.type.of;
      } catch (e) {
        // console.log(e);
        error("this object doesn't have so many dimensions");
      }
      w = new Constant(this.type.width);
      t1 = new Arith(new Token('*'), i, w);
      t2 = new Arith(new Token('+'), loc, t1);
      loc = t2;
    }
    return new Access(a, loc, type);
  }
}