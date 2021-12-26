var startTime = performance.now();

function print(seaFloor) {
  return;
  seaFloor.forEach((row) => {
    console.log(row.join(""));
  });
}

function processHerd(input, animal) {
  var boundryY = input.length - 1;
  var boundryX = input[0].length - 1;
  var moves = false;

  var output = input.map((row) => []);

  input.forEach((row, rowIndex) => {
    var oRow = output[rowIndex];

    row.forEach((cell, colIndex) => {
      if (oRow[colIndex] !== undefined) return;
      else if (cell !== animal) oRow[colIndex] = cell;
      else {
        var targetR = rowIndex,
          targetC = colIndex;
        if (animal == 1) {
          targetC++;
        } else {
          targetR++;
        }

        if (targetR > boundryY) targetR = 0;
        if (targetC > boundryX) targetC = 0;

        var target = input[targetR][targetC];

        if (target == 0) {
          moves = true;
          oRow[colIndex] = 0;
          output[targetR][targetC] = animal;
        } else {
          oRow[colIndex] = animal;
        }
      }
    });
  });

  return [output, moves];
}

function processStep(input) {
  var [output1, moves1] = processHerd(input, 1);

  print(output1);
  var [output2, moves2] = processHerd(output1, 2);

  return [moves1 || moves2, output2];
}

function processSteps(seaFloorState) {
  var anyMoved = false;
  var steps = 0;
  do {
    steps++;
    [anyMoved, seaFloorState] = processStep(seaFloorState);

    //console.log("");
    //console.log("");
    console.log(`------------After ${steps}--------`);
    print(seaFloorState);
  } while (anyMoved);
}

function processTest(input) {
  // Remove new line
  input.splice(input.length - 1, 1);

  if (input.length <= 1) return;

  var numericInput = input.map((line) => {
    return line.split("").map((c) => {
      if (c == ".") return 0;
      if (c == ">") return 1;
      if (c == "v") return 2;
      throw "ruh roh";
    });
  });

  processSteps(numericInput);
}

var testData = `v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>
`;
processTest(testData.split("\n"));

var puzzleData = document.body.firstChild.textContent.split("\n");
processTest(puzzleData);

var endTime = performance.now();
console.log(`took ${endTime - startTime} ms`);
