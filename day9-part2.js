var testInput = `2199943210
3987894921
9856789892
8767896789
9899965678
`;

var x = document.body.firstChild.textContent.split("\n");
x = testInput.split("\n");

x.splice(x.length - 1, 1);

var rows = [];
for (var i = 0, j = x.length; i < j; i++) {
  var row = [];
  x[i].split("").forEach((el) => {
    row.push(+el);
  });

  rows.push(row);
}

var width = rows[0].length;
var height = rows.length;
var log = false;

var globalObserved = {};

function getKey(i, j) {
  return i.toString() + "," + j.toString();
}
function isObserved(observed, i, j) {
  var key = getKey(i, j);
  return observed.hasOwnProperty(key);
}

function sizeBasin(i, j, observed = {}) {
  var cell = rows[i][j];

  observed[getKey(i, j)] = true;
  globalObserved[getKey(i, j)] = true;

  if (cell == 9) return 0;

  var size = 1;
  log && console.log({ cell, i, j, observed });

  if (
    i > 0 &&
    (rows[i - 1][j] >= cell + 1 || rows[i - 1][j] == cell) &&
    !isObserved(observed, i - 1, j)
  ) {
    //console.log("up");
    size += sizeBasin(i - 1, j, observed);
  }

  if (
    i < height - 1 &&
    (rows[i + 1][j] >= cell + 1 || rows[i + 1][j] == cell) &&
    !isObserved(observed, i + 1, j)
  ) {
    //console.log("down");
    size += sizeBasin(i + 1, j, observed);
  }

  if (
    j > 0 &&
    (rows[i][j - 1] >= cell + 1 || rows[i][j - 1] == cell) &&
    !isObserved(observed, i, j - 1)
  ) {
    log && console.log("left");
    size += sizeBasin(i, j - 1, observed);
  }

  if (
    j < width - 1 &&
    (rows[i][j + 1] >= cell + 1 || rows[i][j + 1] == cell) &&
    !isObserved(observed, i, j + 1)
  ) {
    log && console.log("right");
    size += sizeBasin(i, j + 1, observed);
  }

  log &&
    console.log(size.toString() + "after" + i.toString() + "," + j.toString());

  return size;
}

var basinSizes = [];

rows.forEach((row, i) => {
  row.forEach((cell, j) => {
    if (i > 0 && rows[i - 1][j] <= cell) return;
    if (i < height - 1 && rows[i + 1][j] <= cell) return;
    if (j > 0 && rows[i][j - 1] <= cell) return;
    if (j < width - 1 && rows[i][j + 1] <= cell) return;

    log && console.log("starting basis search");
    basinSizes.push(sizeBasin(i, j, {}));
  });
});

basinSizes.sort((a, b) => a - b);
var sum = 1;
for (var j = basinSizes.length - 1, i = basinSizes.length - 4; j > i; j--) {
  log && console.log({ size: basinSizes[j] });
  sum *= basinSizes[j];
}

console.log({ sum });
