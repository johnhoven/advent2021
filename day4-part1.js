var x = document.body.firstChild.textContent.split("\n");
x.splice(x.length - 1, 1);

const Numbers = x[0].split(",").map((a) => +a);
const NumberDict = {};
Numbers.forEach((a, i) => {
  NumberDict[a] = i;
});

const cards = [];
let card = {};
const cardsMirror = [];
for (var i = 2, j = x.length; i < j; i++) {
  if ((i - 2) % 6 == 0) {
    card = {};
    cards.push(card);
    var mirror = [];
    mirror[0] = [];
    mirror[1] = [];
    mirror[2] = [];
    mirror[3] = [];
    mirror[4] = [];
    cardsMirror.push(mirror);
  }
  if ((i - 2) % 6 == 5) continue;

  card[(i - 2) % 6] = x[i]
    .replace(/\s+/g, " ")
    .split(" ")
    .map((a) => +a);
}

//console.log({ x, cards, Numbers, NumberDict });

function isSolved(cardsMirror) {
  for (var i = 0; i < 5; i++) {
    if (
      !!(
        (cardsMirror[0][i] &&
          cardsMirror[1][i] &&
          cardsMirror[2][i] &&
          cardsMirror[3][i] &&
          cardsMirror[4][i]) ||
        (cardsMirror[i][0] &&
          cardsMirror[i][1] &&
          cardsMirror[i][2] &&
          cardsMirror[i][3] &&
          cardsMirror[i][4])
      )
    ) {
      //debugger;
      return true;
    }
  }
  return false;
}

function applyNumber(n) {
  for (var f = 0, g = cards.length; f < g; f++) {
    var cardChange = false;
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 5; j++) {
        //console.log('comparing ', cards[f][i][j], n)
        if (cards[f][i][j] == n) {
          cardsMirror[f][i][j] = true;
          cardChange = true;
        }
      }
    }

    if (cardChange && isSolved(cardsMirror[f]) === true) return f;
  }

  return -1;
}

for (var i = 0, j = Numbers.length; i < j; i++) {
  var solved = applyNumber(Numbers[i]);
  if (solved > -1) {
    //console.log( { Numbers, solved, winningNumber: Numbers[i], index: i, winningCard: cards[solved], m: cardsMirror[solved] } );
    var winningCard = cards[solved],
      markings = cardsMirror[solved],
      unmarkedSum = 0;
    var z = 0,
      y = 0;
    while (z < 5) {
      y = 0;
      while (y < 5) {
        if (!markings[z][y]) unmarkedSum += winningCard[z][y];
        y++;
      }
      z++;
    }

    console.log({
      winningCard,
      markings,
      unmarkedSum,
      winningNumber: Numbers[i],
      answer: unmarkedSum * Numbers[i],
    });

    break;
  }
}

console.log({ cards });
