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

function adjust(risk, by) {
  risk = risk + by;
  if (risk > 9) return risk - 9;
  return risk;
}

var nodes = [];
var oLen = x[0].length;
var length = x[0].length * multiplyBy;
var oHeight = x.length;
var height = x.length * multiplyBy;

var dupes = {};

function node(risk, tentativeDistance) {
  this.risk = risk;
  this.unvisited = true;
  this.tentativeDistance = tentativeDistance;
}

x.forEach((line, lineNo) => {
  line.split("").forEach((risk, colNo) => {
    for (var xi = 0, xj = multiplyBy - 1; xi <= xj; xi++) {
      for (var yi = 0, yj = multiplyBy - 1; yi <= yj; yi++) {
        var yOffset = lineNo * length + yi * length * oHeight;
        var xOffset = colNo + oLen * xi;
        var index = yOffset + xOffset;
        nodes[index] = new node(
          adjust(+risk, xi + yi),
          Number.POSITIVE_INFINITY
        );
        if (dupes.hasOwnProperty(index)) debugger;
        dupes[index] = 1;
      }
    }
  });
});

nodes[0].risk = 0;
nodes[0].tentativeDistance = 0;

function calculateTenativeDistance(fromNode, x, y) {
  var from = fromNode.tentativeDistance;
  var toIndex = getIndex(x, y);
  var toNode = nodes[toIndex];

  if (!toNode.unvisited) {
    return;
  }

  var risk = toNode.risk;
  var cost = from + risk;

  if (cost < toNode.tentativeDistance) {
    toNode.tentativeDistance = cost;
  }
}

function considerNeighbors(x, y) {
  var index = getIndex(x, y);
  console.log(`working on ${index} - (${x},${y})`);
  var fromNode = nodes[index];

  if (x < length - 1) {
    calculateTenativeDistance(fromNode, x + 1, y);
  } // try go right
  if (x > 0) {
    calculateTenativeDistance(fromNode, x - 1, y);
  } // try go left
  if (y < height - 1) {
    calculateTenativeDistance(fromNode, x, y + 1);
  } // try go down
  if (y > 0) {
    calculateTenativeDistance(fromNode, x, y - 1);
  } // try go up

  fromNode.unvisited = false;

  if (x == length - 1 && y == height - 1) {
    console.log({ cost: fromNode.tentativeDistance });
    return false;
  }

  return true;
}

var [smallX, smallY] = [0, 0];

var unfinished = true;
do {
  unfinished = considerNeighbors(smallX, smallY);

  if (unfinished) {
    var min = null;
    var minIndex = -1;
    nodes.forEach((n, index) => {
      if (n.unvisited && (min == null || n.tentativeDistance < min)) {
        min = n.tentativeDistance;
        minIndex = index;
      }
    });

    if (min == null) {
      console.log("ruh roh");
      break;
    }

    [smallX, smallY] = getXY(minIndex);
  }
} while (unfinished);

function getIndex(x, y) {
  return y * length + x;
}

function getXY(index) {
  return [index % length, Math.floor(index / length)];
}

var endTime = performance.now();
console.log(`took ${endTime - startTime} ms`);
