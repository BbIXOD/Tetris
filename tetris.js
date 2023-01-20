'use strict';

let score = 0;
const border = { x: 10, y: 10 };
const curPos = { x: 0, y: 0 };
let curBlock;
const blockNames =  ['brick', 'stick', 'plus', 'zigzag', 'chair',];
const blocks = {
  'brick': [[0.5, 0.5], [0.5, -0.5], [-0.5, 0.5], [-0.5, -0.5]],
  'stick': [[0.5, -1.5], [0.5, -0.5], [0.5, 0.5], [0.5, 1.5]],
  'plus': [[0, 0], [0, 1], [1, 0], [-1, 0]],
  'chair': [[0, 0], [0, -1], [1, 0], [2, 0]],
  'zigzag': [[-0.5, 0.5], [0.5, -0.5], [-0.5, -0.5], [0.5, -1.5]],
};
const blockCenter = {
  'brick': [-0.5, -10.5],
  'stick': [-0.5, -10.5],
  'plus': [0, -10],
  'chair': [0, -10],
  'zigzag': [-0.5, -9.5]
};
const stdin = process.stdin;
stdin.setRawMode(true);
stdin.setEncoding('utf8');
stdin.resume();


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const sleep = ms => new Promise(resolve => setTimeout(() => resolve(), ms));

const field = (() => {
  const array = [];
  const array2 = new Array(border.x).fill('#');
  for (let i = 0; i < border.y; i++) {
    array.push([...array2]);
  }

  return array;
})();

const showField = () => {
  let str = '';
  console.clear();
  for (const arr of field) {
    for (const value of arr) {
      str += value;
    }
    console.log(str);
    str = '';
  }
};

const chooseBlock = () => {
  curPos.x = border.x / 2;
  curPos.y = 0;
  curBlock = blockNames[getRandomInt(blockNames.length)];
  for (let i = 0; i <= getRandomInt(4); i++) turn();
  if (getRandomInt(2) === 1) reflect();
};

const checkMove = type => {
  let x0 = curPos.x + blockCenter[curBlock][0];
  let y0 = curPos.y + blockCenter[curBlock][1];
  if (type ===  'fall') y0 += 1;
  else if (type === 'left') x0 -= 1;
  else if (type === 'right') x0 += 1;
  for (const item of blocks[curBlock]) {
    const x = x0 + item[0];
    const y = y0 + item[1];
    if (x >= border.x || y >= border.y || x < 0 ||
                0 <= x && 0 <= y &&
                field[y][x] !== '#') return false;
  }
  return true;
};

const draw = some => {
  let flag = false;
  for (const item of blocks[curBlock]) {
    const x = item[0] + curPos.x + blockCenter[curBlock][0];
    const y = item[1] + curPos.y + blockCenter[curBlock][1];
    if (0 <= x && x < border.x &&
            0 <= y && y < border.y) {
      field[y][x] = some;
      flag = true;
    }
  }

  return flag;
};

const renderBlock = (type = 'fall') => {
  let flag;
  draw('#');
  if (checkMove(type)) {
    if (type ===  'fall') curPos.y++;
    else if (type === 'left') curPos.x--;
    else if (type === 'right') curPos.x++;
  } else if (type === 'fall') type = 'choose';
  flag = draw(0);
  if (type === 'choose') {
    if (field[0].indexOf(0) !== -1) {
      console.log('Your score', score);
      process.exit(1);
    }
    chooseBlock();
    strike();
    renderBlock('fall');
  }
  if (!flag) renderBlock();
  showField();
};

const checkIsFalling = (x, y) => {
  for (const el of blocks[curBlock]) {
    if (el === [x - curPos.x - blockCenter[curBlock][0], y - curPos.y - blockCenter[curBlock][1]]) return false;
  }
  return true;
};

const turn = () => {
  draw('#');
  for (const el of blocks[curBlock]) {
    const temp = el[1] * -1;
    el[1] = el[0];
    el[0] = temp;
  }
  if (!checkMove('turn')) {
    for (const el of blocks[curBlock]) {
      const temp = el[0] * -1;
      el[0] = el[1];
      el[1] = temp;
    }
  }
  draw(0);
};

const reflect = () => {
  for (const el of blocks[curBlock]) {
    el[1] *= -1;
  }
}

const strike = () => {
  let addScore = 10;
  for (let i = field.length - 1; i >= 0; i--) {
    if (!field[i].includes('#')) {
      for (const el in field[i]) {
        if (!checkIsFalling(el, i)) return;
      }
      for (let el = i; el > 0; el--) {
        for (let el2 = 0; el2 < border.x; el2++) {
          if(checkIsFalling(el2, el - 1))
            field[el][el2] = field[el - 1][el2];
        }
      }
      score += addScore;
      addScore += 10;
      strike();
    }
  }
  showField();
}
chooseBlock();
const loop = () => {
  sleep(1000)
    .then(renderBlock)
    .then(loop);
};
stdin.on('data', key => {
  switch (key) {
  case 'w':
    turn();
    return;
  case 'a':
    renderBlock('left');
    return;
  case 'd':
    renderBlock('right');
    return;
    case 's':
    renderBlock('fall');
    score++;
    return;
  }
});

loop();
