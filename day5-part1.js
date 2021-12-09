var x = document.body.firstChild.textContent.split("\n");
x.splice(x.length - 1, 1);

var matrix = {};
var multi = 0;

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

x.forEach((line) => {
  [start, end] = line.split("->");
  [x1, y1] = start.split(",");
  x1 = +x1;
  y1 = +y1.trim();

  [x2, y2] = end.split(",");
  x2 = +x2;
  y2 = +y2.trim();

  if (x1 == x2) recordLineX(x1, y1, y2);
  if (y1 == y2) recordLineY(y1, x1, x2);
  if (y1 == y2 && x1 == x2) {
    console.log("tricky");
  }
});

console.log({ matrix, multi });
