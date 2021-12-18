var startTime = performance.now();

var testInput = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581
`;

var x = document.body.firstChild.textContent.split("\n");
x = testInput.split("\n");
// Remove empty last line
x.splice(x.length - 1, 1);

// Start at end (cost 1)
// For each unvisited direction calculate combined cost, track visisted
// 1+1, 1+8
// Branch out
// 1+1 --> 1+1+9 and 1+1+2
// From each node, track the best cost to finish
// When we have covered all nodes, answer should be on start node

var risks = [];
var length = x[0].length;
var height = x.length;
x.forEach((line, lineNo) => {
  line.split("").forEach((risk, colNo) => {
    risks[lineNo * length + colNo] = +risk;

    if (lineNo === 0 && colNo === 0) risks[lineNo * length + colNo] = 0;
  });
});

var travelCosts = [];

function getIndex(x, y) {
  return y * length + x;
}

function getXY(index) {
  return [Math.floor(index / length), index % length];
}

function move(x, y, fromX, fromY, costToEnd) {
  var index = getIndex(x, y);
  var fromIndex = getIndex(fromX, fromY);
  var cost = risks[index];
  var node = travelCosts[index] || { traveled: {}, cost: cost, illegal: false };

  if (node.illegal) return false;

  travelCosts[index] = node;
  if (node.traveled.hasOwnProperty(fromIndex)) return false;

  node.traveled[fromIndex] = costToEnd;

  return true;
}

function getBestCost(index) {
  var node = travelCosts[index];
  var min = -1;
  for (var x in node.traveled) {
    var cost = node.traveled[x];
    if (min == -1 || min > cost) min = cost;
  }

  if (min == -1) throw new Error("uh oh");

  node.illegal = true;

  return min;
}

var [endX, endY] = getXY(risks.length - 1);
var endCost = risks[risks.length - 1];
travelCosts[risks.length - 1] = {
  traveled: { na: 0 },
  cost: endCost,
  illegal: true,
};

for (var y = height - 1; y >= 0; y--) {
  for (var x = length - 1; x >= 0; x--) {
    var cost = getBestCost(getIndex(x, y)) + risks[getIndex(x, y)];
    if (x < length) {
      move(x - 1, y, x, y, cost);
    } // try go right
    if (x > 0) {
      move(x + 1, y, x, y, cost);
    } // try go left
    if (y < height) {
      move(x, y - 1, x, y, cost);
    } // try go down
    if (y > 0) {
      move(x, y + 1, x, y, cost);
    } // try go up

    if (x === 0 && y === 0) {
      console.log({ result: cost });
    }
  }
}

var endTime = performance.now();
console.log(`took ${endTime - startTime} ms`);
