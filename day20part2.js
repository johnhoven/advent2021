var startTime = performance.now();

function getNumberCell(image, row, col, k) {
  var bits = [];

  if (row < 1) bits.push("000");
  else if (row > image.length) bits.push("000");
  else {
    if (col < -1) bits.push("000");
    else if (col > k) bits.push("000");
    else if (col == -1) bits.push("00" + image[row - 1][0]);
    else if (col == 0) bits.push("0" + image[row - 1][0] + image[row - 1][1]);
    else if (col == k) bits.push(image[row - 1][k - 1] + "00");
    else if (col == k - 1)
      bits.push(image[row - 1][k - 2] + image[row - 1][k - 1] + "0");
    else {
      bits.push(
        image[row - 1][col - 1] + image[row - 1][col] + image[row - 1][col + 1]
      );
    }
  }

  if (row < 0) bits.push("000");
  else if (row > image.length - 1) bits.push("000");
  else {
    if (col < -1) bits.push("000");
    else if (col > k) bits.push("000");
    else if (col == -1) bits.push("00" + image[row][0]);
    else if (col == 0) bits.push("0" + image[row][0] + image[row][1]);
    else if (col == k) bits.push(image[row][k - 1] + "00");
    else if (col == k - 1)
      bits.push(image[row][k - 2] + image[row][k - 1] + "0");
    else {
      bits.push(image[row][col - 1] + image[row][col] + image[row][col + 1]);
    }
  }

  if (row < -1) bits.push("000");
  else if (row > image.length - 2) bits.push("000");
  else {
    if (col < -1) bits.push("000");
    else if (col > k) bits.push("000");
    else if (col == -1) bits.push("00" + image[row + 1][0]);
    else if (col == 0) bits.push("0" + image[row + 1][0] + image[row + 1][1]);
    else if (col == k) bits.push(image[row + 1][k - 1] + "00");
    else if (col == k - 1)
      bits.push(image[row + 1][k - 2] + image[row + 1][k - 1] + "0");
    else {
      bits.push(
        image[row + 1][col - 1] + image[row + 1][col] + image[row + 1][col + 1]
      );
    }
  }

  return parseInt(bits.join(""), 2);
}

function print(intro, image, print, cleanup) {
  var count = 0;
  console.log("");
  console.log(intro);
  //console.log(`rows: ${image.length}, columns: ${image[0].length}`);
  //console.log("");

  // Remove border
  if (cleanup) {
    image.splice(0, cleanup);
    image.splice(image.length - cleanup, cleanup);
  }

  image.forEach((row) => {
    // Remove edge
    if (cleanup) {
      row.splice(0, cleanup);
      row.splice(row.length - cleanup, cleanup);
    }

    var pretty = row.map((c) => (c == "0" ? "." : "#"));
    row.forEach((c) => {
      if (c == "1") count++;
    });
    print && console.log(pretty.join(""));
  });
  //console.log("");
  console.log(`Result: ${count}`);
  //console.log({ image });
  return count;
}

function applyFilter(filter, image, padding) {
  var output = [];
  if (!image.length) return;

  var length = image[0].length;

  for (var row = -padding, j = image.length + padding; row < j; row++) {
    var outputRow = [];
    output.push(outputRow);
    for (var col = -padding, k = length, p = k + padding; col < p; col++) {
      var result = getNumberCell(image, row, col, k);
      var filterRes = filter[result];
      if (filterRes == 1) outputRow.push("1");
      else outputRow.push("0");

      /*console.log(
        `(${row},${col}) = ${result} from ${result.toString(
          2
        )} - filterRes: ${filterRes}`
      );*/
    }
  }

  return output;
}

function processTest(x) {
  // Remove empty last line
  x.splice(x.length - 1, 1);
  if (x.length <= 2) return;

  var filter,
    image = [];
  x.forEach((line, lineNo) => {
    if (lineNo == 0) {
      filter = line.split("").map((c) => (c == "." ? 0 : 1));
    }
    if (lineNo > 1) {
      image.push(line.split("").map((c) => (c == "." ? "0" : "1")));
    }
  });

  for (var i = 0; i < 25; i++) {
    //print("Pre-pass", image);
    image = applyFilter(filter, image, 10);
    //print("Pass 1", image, true, false);
    image = applyFilter(filter, image, 0);

    print(i.toString(), image, false, 8);
  }

  return print("Pass 2", image, true, 0);
}

var testData = `..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###
`;

var count = processTest(testData.split("\n"));
if (count != 3351) debugger;

testData = `#.#.#.#.#......#.#.#.#.##..#.##.##..#..##...#.#.#.#...##.##.##.###....#..#...#.#..###.#...#..##.#.###..#..####.###...#.#.#..##..##.##..##..###..#....#.#....#####.#...###...#.#....###...#..##.##..#..#.##..###..#.##.###..#.####...#.##.....#.###...#.##.##.#.#######...#.###..##..##..#.#.#.#####...#....#.....##.#.#...##.######....#..#......#.#.#.#.##...######.#.#####..#####..#.#.#.#.###.#.#....#..##..#..#.#.#..##....##..#.#.......##...#..####.####.#.#..#.###..#...#......###...#...#.##.#.####..#.#....###.####..#.

.#.#.########.##.#...##.####...##..#####...##..#.#.###..#...#.#.##.#.....#..#.###...##..#.###.###.##
.######.#..##.##...#.#.####.#.###..#..#.##.##...##.#...##..#.######...##....###...###..#.#.##.##....
..######.#.#.##.#.##.###.##..#####.####..#......#.##.###.#.#.##...#####.###..###...#..#..#..##.#....
###..##.#...##.#.#...######..#.#..##..##.#.##.#.#.#.##.#..####.#.#.##......#.#.#...#.##..#.###.###.#
#.#.#...#..####...#.#..#.##.####.#..#..###########...#....#.#.##.###..#####.#.#.#.###...##..####.#..
#.#..#.##.#..#..#..#....##.#.#.#...#..###.#.##.##.#.#.##.##..#.#.####.#######....###..#.######.#.#..
......###..#..##.####.##.##..#..#.##.##.#..#...###...####.#..#...###.##.#.#####.....#...#..#...####.
####..##.###.#...##..#.##....#..##.##..####.#.#.####.##..#..#.....#.###......#.#....#.#.....#.#..#..
.###.####.#..###..#.#.#.#...##.####.#..#..##....#...###.#.#....#..#######.###.....#.#.#.##...##.#..#
##.#......#.##.###.#.##..##.##..#######.###..##..#.#####..#.#..#.#.#..#..##..##.##...#####.#.##.####
.#.###....##.......#######..#.########..#..##..#.####.###..#..###.##..#...####.#.#..#.##.######.#..#
..###.#.##..##.#....#..#.####.....#.#..#..##.##.###..#.###.....##..#.##..#..#.#...#...#.#########.##
..#.#.#.#..#...#.##.#.##.#..#...##.#..........#.###.##.##....#####...#.#####.###.#......#..#.#.#..##
#....#..#.#.#.####.#####.#.#.####.###......#.....#.#..######....##....#.##..##.##...#.#####.##..##.#
#.#....#####....###.###.#.#...#.##.#..........#....##.#..##..##.####.##.#.##....##..#.#.##..##.#.###
..####...####..##.#.....#........#.#..##..#.#..###.....####...#...#.###....#....##.#..##.#.##....##.
...#.###........####...#...##..#..##.#.######...#...#.#.#...###....##..##.#..##.......###.##.###...#
##.#####...#.#.##.##.#...#.....#.##.########.....#.##..#.####.##...#......####..#.#..#..#...#.......
.....###..##.###.#.#.#.....##.#.####...#..######.##....#.##.#.#.#...##.####.####.##....##.#.#.###..#
.########..#.#.#.##..#..#..#.#..#..#.#.##.###.###.#...#.#..#####..##.###.#.##..###.###.#.#.####...##
###..##.##...#...#.....####.#.#......##.####..#......##..#####.#.....#.###.##.....#.##...#...#...###
#.#.#.....##.##..#..#.###.#..##..##..#....#...##.....##..##.####.#######.....#........###..#.##.#.##
.#....##..###.#..###.#...###.#...###...#.#..####..######......##.##.##..#...#..#####.####...##..#...
####.#..#.##....#.#.#...#.#.#####.###.#..##.#.###.....#..#.##......#.##...##..##...##..####.#...##..
....#.####..#..##.####.#######...#..#########.##.##..#..#.##.##.#.###.##.#.#....#####.###...#.####.#
..#.....##...###..#.##...#.#...###...#######.##..####.##.##..##.#########..###........##....#..#..#.
.#.##.#.#.##.....##.#.##..###.###.#.....###...###..#.#.#####.##.#....##.#.##.##.##.#.#....#........#
.#.#..#.#............#....###.#...####..####....#..#.##..#.##..#####...###.######...##..#####..###..
###.#..##.#...##..#.#..#..##.#..#..#..#..#####......##.##..#####..#......#..#####.##.####......##.##
##...#...##.#####..#...#.#.....#.#..###.#..#.####.....#.....#.#.#.#.###.####..#.......##.#....#..##.
#...#.#..#####..###.........#.####.###..#....###...#......#...#.#..#.....#####..#.###...#.#...#.....
###....#..##.##.####.###.#.#.##.#.#....##..#....##..#.#.###..######.#.#.#..####.##...####..##..##.##
.###...##.#.#####.#...#.###..##..###....#.##....#...#.#..#...##.###...#.#.#.#######......###.###.#.#
.#.#.#.....#..##..#.##.#..#.....#.#.######..#.##.#....###.#....#...#####..#.######.###....###...####
####..#....########...#..##..#####.#...#.##..##..###...###.#####....##.#.#..#.###.#.#..#.#.#..#.###.
.##.##.##.#####...#..#..#.###.#.#..###.#......###.##.#.###..#####.#.#...#.###.#.#.###.##.#...#.##.#.
#.#.##....#####...##.#.##.######.#.#.##.###.#.......###......##..###.#.###...##..##.#.#...#..##.####
##.#....#.##.#..#...#.#...#.##......####.#.#..#..###.#####.#...##.####...#..###.##.#.##..###.####.#.
#.#..#.#.##...##.....###.#.#.#..##.###.#######........###..#.....####.#.##.##...####.##.#.##.###.###
##...#.####..#...#...##.#.##..#.##.###..#.##..##......#..#.#...######..#....#.######..######..####..
.....#.#.......####.....#..#.####.#...##..##...#....#.########.#.#.##..##.##..####..##.####..#.#.###
.#..#.#....#..##..#....##...###........#.#..#.##.####....###..#..##...#..##.#.#.###.#.#.#..#.####...
#.#...###.#....#...##############...###..##...#.#.##..#..#....#...####....##..###.##..##..##.#..##.#
##..#....#...#..#..##.#..###....#.#.#.###.#.#.###..###..####.###.#.#.###.#..###.#.###.#.##...#.#####
#..#..####.....###..#.#...##.######..####..#..#....#####...#...#..#..#.....#.##.####......#..##.###.
##.##..###.###.#..###...#.####...#....#........#..#..##..##..##.#.##....#.......#.###...#..###.#....
#.##.#.#..#..###..###...#...#.###..####.#.#....#.#.......##...#..#......##....##.#####.......#...#..
....#..#..##.##.#.##.#.##..#.##..##.##.##.##..##.######.##..##.....#.###..#...#.##.#.#.####.###.###.
.###....##.##..##..#.###..##.#..#.#.##..##.###..##.###..#......########.#####....##...#...##...##.##
.###.###.#.#######.......#.#.#.##.##..#.#.#.##..#.##...##.##.#...##.#.#######.#..#..##..#.#..##.##.#
....#.###.#.##...##..#...#...#..##...#.##...##.##.##.#.#####.....#.#.#.##..####.####.#..####..#..##.
##..#.##.#######.#.#...###.#....###.###..##.###.##.##.#.#..##.....#.##......##.###..##.#.#.##..##...
...#####.#.##.#..##....##.###.##.#..##..###......#.#..####.##...##.#.###...##.....#..#..###..#####..
.#####.#.#..#....####.#####.#..##..#.#####.##..#.#.#..##...#.#..######.###..##....###.#....###...#.#
..###......##.##.#.##..#..##.....##....##.##..##.....###.#..##.#.#######..#...####..#.###.#####.###.
##..#.######.####..#.#..###.#..#.#..#######.#...#...##.#.###.#.##..##.#......##.#.#..##.#.#.#.####..
..#.#.####.##..##.#.#.#..####.#.##...###..#.##..#.##.###..####......#..#..#####.#..#.#####.#.###.###
#..#.#.....#.#...#..###.####..##..#....##.#.###..##..#.#..#.####...##..##..#..####...#########....##
.#.....#......##.#..#.####.######..#.#.#.#.##...#..#..#...#.###..#....#..#.#...#####..###.##...#.##.
.####....#.###..#..###.#...#..###.#.#..#......###.##.#.#.#.#####..#######..####.##.....#....#..##.#.
...#.##.#.#..####.#####..##..#.##.###.#####..###...##...##.##..#.####..##.#...####...#..##......###.
###...##.....#.###...##.#..#.#......##..#...##.#..##.#.#..#.###..#..#####..#.###..#.#...#..##.#.#.#.
##.##.##.#.#.#.####.##..##....#.####.####.####...##.####.#....###....###.###.#..#.####.#...####.#.#.
####.###...####.#.##...#...##..##...##....#.#.####..#..#.....#.....##....###.....###...#...##.#.###.
######..#..#####...#..#..######.##...#.###.#....####..####.##.#.#..#.#.####.##.####..##...####.##.#.
##....#.#...#..###..#.##.#.#...###..####.....#.##.#.####..#.##....##...##########..##...###.#.###.##
..#.#######....#####..##.####.##.#####..###.#.#..####.....###########...##.#....#.#..##.##.###..###.
##.....##...#..#....#####...#...#..#.#.#.#.####....##...####.#.#.#.....#.#..........#.###..##.#.#.#.
.#####...#..#.##..##.#...#.#.##..###..#.#....#...#.#.#..#.#..#..#.###.#...######.#.####..##..##.#...
..#.#.#.##..#.##..#.###......###..#....##.###.#..###.#...##.#.#.....#.##....##.##.##.#...####.####.#
##..#.##.##.##.#....##.#..#..#.##.###..##.##.#.#.#......####..##.#.#.###.....##.....#.##..####..##.#
.###.#.##.#..##.##.#.###.#.##.##.#####...#.#..#..#..#..#.####..#.######..#.#.#...#..#####...#.#..##.
..#...#.####.####.####...#..#..##..#.##.#.#..#..####..#...#.####.#.###.##..#......#..#...#..#..###..
.#..#.###.......#..##.#.#..##..#.#..#..##..#.....####.###...#..#.###.##.#..#.#..##..#...##.##.##....
#....##..#...##.###.#......##..###...##.###..##..###.####.....#...###..#.#...#####.#.#.######..#..#.
##.###.....#...#.#..##.#.#..#.#....#...#..##.######.###.#.####.#.######...#.#.#....##.##..#...#...#.
.......#..#.##..#..##...#.##.#####..###.####.###.#.#..###....#.#........#..#.#.#.......####..#......
#####...##.######....#.#.##.#..##...#..#..#..#...#..##.###....#.#.......##...#.###.###..####.##.###.
.###.##.#....#.#..#..#..##....##...##.#...##....#......#####...####.######.#.#.##.##..##.#.#.....#..
..#.##..#.####..####.##.#...#..####..##.....###.#...###..#.###.######.#.#.##..#.#.#####.#.##.#.##...
.##.###########.#..####.#.####..#.####.##########..#.##.#.#.#..#.#..#.#####.....##.#...#.###..#.##..
...###.#.#..#.#.#.#....#..##..####.##...###.#....#.#.####.#.#..#..####...####..###.##..######.##....
#..#####.#######.#.###......#..#.#.##.##.###.#.##.#...#....#.#####..###..##.#.#####.#..#..#.###.#..#
#.####..#..#.......###..#..####.#.#.#..#.#..#..#.#...#####.#.......####.#.#.##.##.#..#..##.#....##.#
###.###...#..#..##.#..#.#..#..#####.#.#####.....#..#..####....##.##.....#.....#.###.#.#.#.##.#.####.
.#.##.#.#..#.#####.#.##.#.###.#...#..#..#.#...##.#.##......#.#.#####..#......###.########.#..#.###.#
#.##.....#.####..######..##..#...#.....##..##..#.#.##.###.#.#.#.#.....#...#.#..###..##..##.######.##
####......#.##..#.##..##.##..#.##.....#####...#.#...###.#..##..###.##.###..............##.#.#....#.#
###...##.##.##.####....####..#...##...#.####.#....#.....#####.....##...##..###.#...##.#...##.##.##..
#.#.####...###.....###.###.##.###.....##.##.....###..###..##......##..####.#..##.#.##....##.#.#..#.#
####...###.#####.#####.......##..##.###..#..##.##..#..###.#..#..###.....##..##..##.##.#..####.#.#.#.
######....#.##.##.#.###...##...###.###.#.##.###....##.#......#.##.##.#####...#..##....###...#..##...
..#...........##..........#.##.#.##.##.###...##..##.#####.#####.#...##..####.....#.##....#..#.###.##
.#..##.#...#.#####...##.#.#.###.#.#..##..#..##########..#.#...#...#...##.##.#...##..#.#.#.##.#..#..#
..##....##.#..#...#.#...#.#....#..#.#.#####.##.#......#...##..######..##....####..##.##.##.###.###..
#.......#..############...##....##...#.#....#...##..###..##....####..##....#...##.###...#..#...#####
..##..##..#.###.#.##.#.####.#.##...#.#..#.#####...######...######.####...###.#.#.##..#.######..#.#..
###.#....#####..#.##.##..###..##.#..#.#.#.##.#......#..#....##.#.#.###..#.#######.###..#..#..#.###..
#...#.#..#.####.###..##.#.#####...#.#.##..#..#.#####.#.###.##.####..#..##.#.##...##...####.#..#.###.
...#.##.##...#.#...####....#..#####...#.#.....####.##.######.#.#...#...###.##..##.#.#.#..#...###.#..`;

//count = processTest(testData.split("\n"));
//if (count != 5326) debugger;

var x = document.body.firstChild.textContent.split("\n");
processTest(x);

var endTime = performance.now();
console.log(`took ${endTime - startTime} ms`);