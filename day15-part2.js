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

/*
testInput = `11111
99991
99111
99199
99111
`;*/
var multiplyBy = 5;

var x = document.body.firstChild.textContent.split("\n");
//x = testInput.split("\n");
// Remove empty last line
x.splice(x.length - 1, 1);

// Start at end (cost 1)
// For each unvisited direction calculate combined cost, track visisted
// 1+1, 1+8
// Branch out
// 1+1 --> 1+1+9 and 1+1+2
// From each node, track the best cost to finish
// When we have covered all nodes, answer should be on start node

function adjust(risk, by) {
  risk = risk + by;
  if (risk > 9) return risk - 9;
  return risk;
}

var risks = [];
var oLen = x[0].length;
var length = x[0].length * multiplyBy;
var oHeight = x.length;
var height = x.length * multiplyBy;

var dupes = {};

x.forEach((line, lineNo) => {
  line.split("").forEach((risk, colNo) => {
    for (var xi = 0, xj = multiplyBy - 1; xi <= xj; xi++) {
      for (var yi = 0, yj = multiplyBy - 1; yi <= yj; yi++) {
        var yOffset = lineNo * length + yi * length * oHeight;
        var xOffset = colNo + oLen * xi;
        var index = yOffset + xOffset;
        risks[index] = adjust(+risk, xi + yi);
        if (dupes.hasOwnProperty(index)) debugger;
        dupes[index] = 1;
      }
    }
  });
});

/*
for (var yi = 0, yj = 4; yi <= yj; yi++) {
  for (var xi = 0, xj = 4; xi <= xj; xi++) {
    var yOffset = 99 * length + yi * length * oHeight;
    var xOffset = 99 + oLen * xi;

    console.log({
      risk: risks[yOffset + xOffset],
      xOffset,
      yOffset,
      xi,
      yi,
      index: yOffset + xOffset,
    });
  }
}
*/

risks[0] = 0;

var travelCosts = [];

function getIndex(x, y) {
  return y * length + x;
}

function getXY(index) {
  return [Math.floor(index / length), index % length];
}

function move(x, y, fromX, fromY, costToEnd, recurse = true) {
  var index = getIndex(x, y);
  var fromIndex = getIndex(fromX, fromY);

  //if (index == 9 && fromIndex == 14) debugger;

  var cost = risks[index];
  var fromCost = risks[fromIndex];
  var node = travelCosts[index] || { traveled: {}, cost: cost, illegal: false };

  if (node.dead) {
    return;
  }

  var fromNode = travelCosts[fromIndex] || {
    traveled: {},
    cost: fromCost,
    illegal: false,
  };

  //if (node.illegal) return false;

  travelCosts[index] = node;
  travelCosts[fromIndex] = fromNode;

  fromNode.listeners = fromNode.listeners || [];
  fromNode.listeners[index] = index;
  node.listeners = node.listeners || [];
  node.listeners[fromIndex] = fromIndex;

  if (node.traveled.hasOwnProperty(fromIndex)) {
    node.traveled[fromIndex] = costToEnd;

    //if (node.illegal) {
    var oldCost = node.bestCost;
    var bestCost = getBestCost(index);
    if (oldCost != node.bestCost) {
      node.bestCost = bestCost;

      //debugger;
      if (recurse)
        node.listeners.forEach((nodeIndex) => {
          var pushNode = travelCosts[nodeIndex];

          if (!pushNode.dead && pushNode.traveled[index] != bestCost + cost) {
            var [newX, newY] = getXY(nodeIndex);

            move(newX, newY, x, y, bestCost + cost, false);
          }
        });
    }
    //}

    return false;
  }

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
  node.bestCost = min;

  return min;
}

var [endX, endY] = getXY(risks.length - 1);
var endCost = risks[risks.length - 1];
travelCosts[risks.length - 1] = {
  traveled: { na: 0 },
  cost: endCost,
  illegal: true,
};

function getBestPath(y, x, evalCost) {
  //console.log({ x, y });

  var index = getIndex(x, y);
  //if (index == 22) debugger;
  var shortestPath = evalCost ? getBestCost(index) : 99999;
  var risk = risks[index];
  var myCostToEnd = shortestPath + risk;

  if (x < length - 1) {
    move(x + 1, y, x, y, myCostToEnd);
  } // try go right
  if (x > 0) {
    move(x - 1, y, x, y, myCostToEnd);
  } // try go left
  if (y < height - 1) {
    move(x, y + 1, x, y, myCostToEnd);
  } // try go down
  if (y > 0) {
    move(x, y - 1, x, y, myCostToEnd);
  } // try go up

  //console.log({ index, x, y, shortestPath, risk, myCostToEnd });
  if (x === 0 && y === 0) {
    console.log({ result: myCostToEnd });
  }
}

var toDelete = [];
var toDeleteNew = [];
for (var y = height - 1; y >= 0; y--) {
  //for (var x = length - 1; x >= y; x--) {
  //  getBestPath(x, y, false);
  //  getBestPath(y, x, false);
  // }

  console.log({ y });

  //if (y < 450) break;

  var temp = toDelete;
  toDelete.forEach((x) => {
    travelCosts[x] = { dead: true };
  });
  toDelete = toDeleteNew;
  toDeleteNew = [];
  //if (y < 425) break;

  for (var x = length - 1; x >= y; x--) {
    getBestPath(x, y, true);
    getBestPath(y, x, true);
  }

  for (var x = length - 1; x >= y; x--) {
    getBestPath(x, y, true);
    getBestPath(y, x, true);

    toDeleteNew.push(getIndex(y, x));
  }

  // y is x at this point.  Now we go down
  //if (y < height - 1) {
  //  for (var y2 = y + 1; y2 <= height - 1; y2++) {
  //    getBestPath(y, y2);
  //  }
  //}
}

var endTime = performance.now();
console.log(`took ${endTime - startTime} ms`);

/*
var inPath = { 0: true };
var isEnd = false;
var lastIndex = 0;
var iterations = 0;
while (!isEnd) {
  iterations++;
  if (iterations > 1000) break;
  var node = travelCosts[lastIndex];
  var min = -1;
  var minX = null;
  for (var x in node.traveled) {
    var cost = node.traveled[x];
    if (min == -1 || cost < min) {
      min = cost;
      minX = x;
    }
  }

  inPath[minX] = true;
  lastIndex = minX;
  if (lastIndex == 249999 || lastIndex == "na") isEnd = true;
}
*/
