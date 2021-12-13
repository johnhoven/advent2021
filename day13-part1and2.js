var startTime = performance.now();

var testInput = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5
`;

var x = document.body.firstChild.textContent.split("\n");
x = testInput.split("\n");

x.splice(x.length - 1, 1);

var foldInstructions = [];
var endDots = false;
var coords = [];
var maxX = 0,
  maxY = 0;

x.forEach((line, lineNo) => {
  if (!line || line.length == 0) {
    endDots = true;
    return;
  }
  if (endDots) {
    foldInstructions.push(line);
    return;
  }

  var [x, y] = line.split(",");

  if (!coords[+y]) coords[+y] = [];
  coords[+y][+x] = 1;

  if (+x > maxX) maxX = +x;
  if (+y > maxY) maxY = +y;
});

console.log({ coords, foldInstructions, maxX, maxY });

function processFold(fi) {
  [fx, c] = fi.split("=");
  fx = fx.charAt(fx.length - 1);

  if (fx == "y") {
    var foldingUp = coords.splice(+c, maxY + 1 - +c);
    maxY -= foldingUp.length;
    // Delete the fold line
    foldingUp.splice(0, 1);

    // Let's not assume folding is always an exact half
    // 0 66666
    // 1 5555
    // 2  4444
    // 3  --- FOLD----
    // 4
    // 5
    // 6

    for (var i = 0, j = foldingUp.length; i < j; i++) {
      var row = coords[maxY - i] || [];
      var rowMerge = foldingUp[i] || [];

      for (var k = 0, l = maxX; k <= l; k++) {
        row[k] = (row[k] || 0) + (rowMerge[k] || 0);
      }

      coords[maxY - i] = row;
    }
  }

  if (fx == "x") {
    // For each y row
    coords.forEach((row) => {
      if (!row) return;

      var foldingLeft = row.splice(+c, maxX + 1 - +c);

      // Delete the fold char
      foldingLeft.splice(0, 1);

      foldingLeft.forEach((v, index) => {
        var mergeIndex = +c - 1 - index;
        row[mergeIndex] = (row[mergeIndex] || 0) + (v || 0);
      });
    });

    maxX -= maxX - +c + 1;
  }
}

foldInstructions.forEach((fi, index) => {
  processFold(fi);

  var count = 0;
  coords.forEach((r) => {
    r.forEach((c) => {
      if ((c || 0) > 0) count++;
    });
  });

  console.log(`after folder ${index} visible dots are: ${count}`);
  //console.table(coords);
});

function printCode() {
  var buffer = "";
  for (var i = 0, j = maxY; i <= j; i++) {
    for (var k = 0, l = maxX; k <= l; k++) {
      var n = (coords[i] || [])[k] || 0;
      if (n > 0) n = 1;
      if (n == 0) n = ".";

      buffer += n;
    }
    buffer += "\n";
  }
  console.log(buffer);
}

printCode();

var endTime = performance.now();
console.log(`took ${endTime - startTime} ms`);
