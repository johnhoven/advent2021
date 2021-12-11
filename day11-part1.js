var testInput = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526
`;

var x = document.body.firstChild.textContent.split("\n");
x = testInput.split("\n");

x.splice(x.length - 1, 1);
var octopi = [];

x.forEach((line, lineNo) => {
  line.split("").forEach((oct) => {
    octopi.push(+oct);
  });
});

//  0  1  2  3  4  5  6  7  8  9
// 10 11 12 13 14 15 16 17 18 19

var flashes = 0;

function tryIncrement(octopi, i, j) {
  if (i >= 0 && i < 10 && j >= 0 && j < x.length) {
    var index = i * 10 + j;
    var o = octopi[index];
    if (o > 0 && o < 10) octopi[index] = o + 1;
  }
}

function runStep() {
  // Simple increment
  octopi.forEach((o, i) => (octopi[i] = o + 1));

  var hasFlashes = false;
  do {
    hasFlashes = false;

    octopi.forEach((o, i) => {
      if (o === 10) {
        hasFlashes = true;
        flashes++;
        octopi[i] = 0;

        // Increment adjacents
        var rowIndex = Math.floor(i / 10);
        var colIndex = i % 10;

        // Left
        tryIncrement(octopi, rowIndex, colIndex - 1);
        // Right
        tryIncrement(octopi, rowIndex, colIndex + 1);
        // Top
        tryIncrement(octopi, rowIndex - 1, colIndex);
        // Down
        tryIncrement(octopi, rowIndex + 1, colIndex);
        // TL
        tryIncrement(octopi, rowIndex - 1, colIndex - 1);
        // TR
        tryIncrement(octopi, rowIndex - 1, colIndex + 1);
        // BL
        tryIncrement(octopi, rowIndex + 1, colIndex - 1);
        // BR
        tryIncrement(octopi, rowIndex + 1, colIndex + 1);
      }
    });
  } while (hasFlashes);
}

for (var i = 0, j = 100; i < j; i++) {
  runStep();
}

console.log({ flashes });
