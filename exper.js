'use strict';
const states = {none: ' ', cross: 'x', zero: 0}
const fieldSize = {x: 3, y:3};
const field = new Array(fieldSize.y);
const winStrategies = {};
const otherStrategies = [];

winStrategies[states.cross] = [];
winStrategies[states.zero] = [];

(() => {
  for (let el of field) {
    el = new Array(fieldSize.x).fill(states.none);
  }
})();

const transpose = arr => {
  const transposedArray = [];
  for (let y = 0; y < fieldSize.y; y++) {
    for (let x = 0; x < fieldSize.x; x++) transposedArray[x][y] = arr[y][x];
  }
  return transposedArray;
}

const isStrike = (arr, state) => {
  for (const el of arr) {
    if (!(el.find(states.none) && el.find(state))) return true;
  }
}

const checkWin = (arr, type) => {
  const aType = (type === states.cross) ? states.zero : states.cross;
  if (isStrike(arr, aType)) return true;
  transpose(arr);
  if (isStrike(arr, aType)) return true;
  if (arr[0[0]] === arr[1][1] && arr[0][0] === arr[2][2] && arr[0][0] === type) return true;
  return arr[0][2] === arr[1][1] && arr[0][2] === arr[2][0] && arr[0][2] === type;

}

const game = (type = states.cross, arr = field, log = []) => {
  let flag  = false;
  for (const y in arr) {
    for (const x in arr[y]) {
      if (arr[y][x] === states.none) {
        const newArr = [...arr];
        newArr[y][x] = type;
        log.push([y, x]);
        if (checkWin(arr, type)) winStrategies.type.push(log);
        else (type === states.cross) ? game(states.zero, newArr, log) : game(states.cross, newArr, log);
        flag = false;
      }
    }
  }
  if (flag) otherStrategies.push(log);
}

game();
console.log(winStrategies);