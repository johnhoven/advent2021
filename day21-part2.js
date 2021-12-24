var startTime = performance.now();

var gamesDict = {};

function addDice(pos, score, diceValue) {
  var pos = (pos + diceValue) % 10;
  var score = score + (pos == 0 ? 10 : pos);
  return [pos, score];
}

function roll(key, times) {
  var [p1Pos, p1Score, p2Pos, p2Score] = key.split(".").map((n) => +n);

  var p1Wins = 0,
    p2Wins = 0;

  for (var i = 1; i <= 3; i++) {
    for (var i2 = 1; i2 <= 3; i2++) {
      for (var i3 = 1; i3 <= 3; i3++) {
        var [newP1Pos, newP1Score] = addDice(p1Pos, p1Score, i + i2 + i3);
        if (newP1Score >= 21) p1Wins++;
        else {
          for (var j = 1; j <= 3; j++) {
            for (var j2 = 1; j2 <= 3; j2++) {
              for (var j3 = 1; j3 <= 3; j3++) {
                var [newP2Pos, newP2Score] = addDice(
                  p2Pos,
                  p2Score,
                  j + j2 + j3
                );

                if (newP2Score >= 21) p2Wins++;
                else {
                  //var gs = new GameState(np1, np2);
                  var gsKey = `${newP1Pos}.${newP1Score}.${newP2Pos}.${newP2Score}`;
                  var gsCount = gamesDict[gsKey] || 0;
                  gsCount = gsCount + times;
                  gamesDict[gsKey] = gsCount;
                }
              }
            }
          }
        }
      }
    }
  }
  return [p1Wins, p2Wins];
}

function play(pos1, pos2) {
  var p1Wins = 0,
    p2Wins = 0;

  gamesDict = {};
  gamesDict[`${pos1}.0.${pos2}.0`] = 1;

  debugger;
  while (Object.keys(gamesDict).length > 0) {
    var gameState = Object.keys(gamesDict)[0];
    var times = gamesDict[gameState];
    delete gamesDict[gameState];

    [p1NewWins, p2NewWins] = roll(gameState, times);

    p1Wins += p1NewWins * times;
    p2Wins += p2NewWins * times;

    console.log(`after ${gameState} - p1: ${p1Wins}, p2: ${p2Wins}.`);
  }
}

function processTest(x) {
  // Remove empty last line
  x.splice(x.length - 1, 1);
  if (x.length <= 1) return;

  var p1 = +x[0].split(": ")[1];
  var p2 = +x[1].split(": ")[1];

  var result = play(p1, p2);

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
