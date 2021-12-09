var testInput = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2
`;

var x = document.body.firstChild.textContent.split("\n");
//x = testInput.split("\n");

x.splice(x.length - 1, 1);

var matrix = {};
var multi = 0;
var max = 0;

function recordLineX(x, y1, y2) {
  if (y1 > y2) {
    var y3 = y1;
    y1 = y2;
    y2 = y3;
  }

  while (y1 <= y2) {
    var key = x.toString() + "," + y1.toString();
    var existing = matrix[key];
    if (existing === undefined) matrix[key] = 1;
    else if (existing === 1) {
      multi++;
      matrix[key] = 2;
    } else {
      matrix[key] = existing++;
    }

    y1++;
  }
}

function recordLineY(y, x1, x2) {
  if (x1 > x2) {
    var x3 = x1;
    x1 = x2;
    x2 = x3;
  }

  while (x1 <= x2) {
    var key = x1.toString() + "," + y.toString();
    var existing = matrix[key];
    if (existing === undefined) matrix[key] = 1;
    else if (existing === 1) {
      multi++;
      matrix[key] = 2;
    } else {
      matrix[key] = existing++;
    }

    x1++;
  }
}

var debugging = false;
function recordLineDiag(x1, x2, y1, y2) {
  //if (x1 > x2) {
  //  var x3 = x1;
  //  var y3 = y1;
  //  x1 = x2;
  //  y1 = y2;
  //  x2 = x3;
  //  y2 = y3;
  //}

  var length = x2 > x1 ? x2 - x1 : x1 - x2;
  length++;

  //if (x1 === 0 && y1 === 0) debugger;

  while (length > 0) {
    var key = x1.toString() + "," + y1.toString();
    var existing = matrix[key];
    if (existing === undefined) matrix[key] = 1;
    else if (existing === 1) {
      multi++;
      matrix[key] = 2;
    } else {
      matrix[key] = existing++;
    }

    if (debugging) console.log(`marking ${x1} ${y1} as ${existing}`);

    length--;
    if (x1 < x2) x1++;
    else x1--;
    if (y1 < y2) y1++;
    else y1--;
  }
}

var cancel = false;
x.forEach((line) => {
  if (cancel) return;

  [start, end] = line.split("->");
  [x1, y1] = start.split(",");
  x1 = +x1;
  y1 = +y1.trim();

  [x2, y2] = end.split(",");
  x2 = +x2;
  y2 = +y2.trim();

  if (x1 > max) max = x1;
  if (x2 > max) max = x2;
  if (y1 > max) max = y1;
  if (y2 > max) max = y2;

  if (x1 == x2) recordLineX(x1, y1, y2);
  else if (y1 == y2) recordLineY(y1, x1, x2);
  else recordLineDiag(x1, x2, y1, y2);
  if (y1 == y2 && x1 == x2) {
    console.log("tricky");
  }
  //cancel = true;
});

console.log({ matrix, multi });

function printMatrix() {
  var print = "";
  for (var i = 0; i < max; i++) {
    for (var j = 0; j < max; j++) {
      var count = matrix[i.toString() + "," + j.toString()] || 0;
      print += count.toString() + " ";
    }
    print += "\n";
  }
  return print;
}

//printMatrix();
