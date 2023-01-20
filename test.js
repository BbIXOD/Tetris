const some = {a: 'a',b: 'b',c: 'c',d: 'd'};
const other = {a: 'a',b: 'b'}

const getKey = (arg, col) => {
  for (const el of Object.keys(col))
    if (col[el] === arg) return el;
}

other[getKey(some, 'a')] = 'c';
console.log(other);

