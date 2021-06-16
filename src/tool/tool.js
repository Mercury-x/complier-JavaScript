import Word from '../lexer/Word'

let chIndex = 0;
let chUserInput = '';


export function getNextCh() {
  if (chIndex < chUserInput.length)
    return chUserInput[chIndex++]
}

export function isNumber(val) {
  const regPos = /^[0-9]+.?[0-9]*/; //判断是否是数字。

  if (regPos.test(val)) {
    return true;
  } else {
    return false;
  }
}

export function isLetter(val) {
  const regPos = /^[A-Za-z]/

  if (regPos.test(val)) {
    return true;
  } else {
    return false;
  }
}

export function isLetterOrDigit(val) {
  const regPos = /^[A-Za-z0-9]/

  if (regPos.test(val)) {
    return true;
  } else {
    return false;
  }
}

export function inputCode(val) {
  chUserInput = val;
  chUserInput = chUserInput.split('');
}

export function nowChCode() {
  console.log('code index: ' + chIndex)
  console.log(chUserInput)
  return chUserInput[chIndex];
}