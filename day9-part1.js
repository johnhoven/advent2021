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

var sum = 0;
rows.forEach((row, i) => {
  row.forEach((cell, j) => {
    if (i > 0 && rows[i - 1][j] <= cell) return;
    if (i < height - 1 && rows[i + 1][j] <= cell) return;
    if (j > 0 && rows[i][j - 1] <= cell) return;
    if (j < width - 1 && rows[i][j + 1] <= cell) return;

    sum += 1 + cell;
  });
});

console.log({ sum });
