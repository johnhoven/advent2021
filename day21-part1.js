var startTime = performance.now();

var nextDieResult = 0;
var dieRolls = 0;
function getDieRoll() {
  nextDieResult++;
  if (nextDieResult > 100) nextDieResult = 1;

  dieRolls++;

  return nextDieResult;
}

function Player(position, num) {
  this.pos = position;
  this.score = 0;
  this.num = num;

  this.turn = () => {
    var d1 = getDieRoll(),
      d2 = getDieRoll(),
      d3 = getDieRoll();

    var sum = d1 + d2 + d3;
    var pos = this.pos + sum;
    this.pos = pos % 10;

    this.score += this.pos == 0 ? 10 : this.pos;

    console.log(
      `Player ${num} rolls ${sum} moves to space ${this.pos} for a total score of ${this.score}.`
    );

    return this.score >= 1000;
  };
}

function play(p1, p2) {
  dieRolls = 0;
  nextDieResult = 0;

  while (true) {
    if (p1.turn())
      return {
        losingScore: p2.score,
        rolls: dieRolls,
        solution: p2.score * dieRolls,
      };
    if (p2.turn())
      return {
        losingScore: p1.score,
        rolls: dieRolls,
        solution: p1.score * dieRolls,
      };
  }
}

function processTest(x) {
  // Remove empty last line
  x.splice(x.length - 1, 1);
  if (x.length <= 1) return;

  var p1 = +x[0].split(": ")[1];
  var p2 = +x[1].split(": ")[1];

  var result = play(new Player(p1, 1), new Player(p2, 2));

  console.log(result);
}

var testData = `Player 1 starting position: 4
Player 2 starting position: 8
`;

processTest(testData.split("\n"));

var x = document.body.firstChild.textContent.split("\n");
processTest(x);

var endTime = performance.now();
console.log(`took ${endTime - startTime} ms`);
