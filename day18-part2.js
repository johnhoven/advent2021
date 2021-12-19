var startTime = performance.now();

function Node(left, right, parent) {
  this.left = left;
  this.right = right;
  this.parent = parent;

  this.getMaxDepth = () => {
    var left = 0;
    if (isNaN(this.left)) left = 1 + this.left.getMaxDepth();
    var right = 0;
    if (isNaN(this.right)) right = 1 + this.right.getMaxDepth();

    if (left > right) return left;

    return right;
  };

  this.print = () => {
    var p = ["["];

    if (!isNaN(this.left)) p.push(this.left);
    else p.push(this.left.print());

    p.push(",");

    if (!isNaN(this.right)) p.push(this.right);
    else p.push(this.right.print());

    p.push("]");
    return p.join("");
  };

  this.leftMost = () => {
    if (!isNaN(this.left)) return [this, +this.left, true];

    return this.left.leftMost();
  };

  this.rightMost = () => {
    if (!isNaN(this.right)) return [this, +this.right, false];

    return this.right.rightMost();
  };

  this.findRight = (from) => {
    if (!isNaN(this.right)) return [this, +this.right, false];

    if (this.right != from) {
      return this.right.leftMost();
    }
    if (!this.parent) {
      return [null, null, null];
    }

    return this.parent.findRight(this);
  };

  this.findLeft = (from) => {
    if (!isNaN(this.left)) return [this, +this.left, true];

    if (this.left != from) {
      return this.left.rightMost();
    }

    if (!this.parent) {
      return [null, null, null];
    }

    return this.parent.findLeft(this);
  };

  this.explode = (depth = 1, parent = null) => {
    if (depth == 5) {
      // Process

      //var left = null;
      //if (+parent.left) {
      //left = parent.left;
      //}

      var [leftParent, left, isLeftLeft] = parent.findLeft(this);
      var [rightParent, right, isLeft] = parent.findRight(this);

      var leftSum = left == null ? 0 : left + +this.left;
      var rightSum = right == null ? 0 : right + +this.right;

      //if (leftParent != this.parent) this.parent.left = 0;
      if (leftParent && isLeftLeft) leftParent.left = leftSum;
      else if (leftParent) leftParent.right = leftSum;

      //if (rightParent != this.parent) this.parent.right = 0;
      //if (!rightParent) this.parent.right = 0;
      if (rightParent && isLeft) rightParent.left = rightSum;
      else if (rightParent) rightParent.right = rightSum;

      if (this == this.parent.left) this.parent.left = 0;
      if (this == this.parent.right) this.parent.right = 0;

      return true;
    } else {
      var exploded = isNaN(this.left) && this.left.explode(depth + 1, this);
      if (!exploded) {
        exploded = isNaN(this.right) && this.right.explode(depth + 1, this);
      }
      return exploded;
    }
  };

  this.findSplitValue = () => {
    var candidate = null;
    if (isNaN(this.left)) candidate = this.left.findSplitValue();
    else if (this.left >= 10) {
      candidate = [this, true, this.left];
    }

    if (candidate == null) {
      if (isNaN(this.right)) candidate = this.right.findSplitValue();
      else if (this.right >= 10) {
        candidate = [this, false, this.right];
      }
    }

    return candidate;
  };

  this.getMagnitude = () => {
    var left;
    if (!isNaN(this.left)) left = this.left;
    else left = this.left.getMagnitude();

    var right;
    if (!isNaN(this.right)) right = this.right;
    else right = this.right.getMagnitude();

    return left * 3 + right * 2;
  };
}
function numberToTree(str) {
  var chars = str.split("");
  var root = null;
  var node = null;
  var parentNodes = [];

  for (var i = 0, j = chars.length; i < j; i++) {
    var c = chars[i];
    if (c == "[") {
      parentNodes.push(node);
      var parent = node || null;
      node = new Node(null, null, parent);
      if (root == null) {
        root = node;
        parentNodes.push(root);
      }
    } else if (!isNaN(+c)) {
      if (node.left == null) node.left = +c;
      else if (node.right == null) node.right = +c;
    } else if (c == ",") {
    } else if (c == "]") {
      var temp = node;
      node = parentNodes.pop();

      if (node.left == null) node.left = temp;
      else if (node.right == null) node.right = temp;
    } else {
      console.log("ruh roh");
    }
  }

  return root;
}

function reduce(root) {
  var actionsApply;
  do {
    actionsApply = false;

    var depth = 1 + root.getMaxDepth();

    // EXPLODE
    if (depth > 4) {
      actionsApply = true;

      root.explode();
      //console.log(`after explode: ${root.print()}`);
    } else {
      // SPLIT

      var candidate = root.findSplitValue();
      if (candidate) {
        var [node, isLeft, num] = candidate;
        actionsApply = true;

        var left = Math.floor(num / 2);
        var right = Math.ceil(num / 2);

        var newNode = new Node(left, right, node);
        if (isLeft) {
          node.left = newNode;
        } else {
          node.right = newNode;
        }

        //console.log(`after split: ${root.print()}`);
      }
    }
  } while (actionsApply);
}

function calcMagnitude(node) {
  return node.getMagnitude();
}

function processTest(x) {
  var largest = null;

  x.forEach((num, i) => {
    x.forEach((num2, j) => {
      if (i == j) return;

      var node = numberToTree(num);
      var node2 = numberToTree(num2);
      var root = new Node(node, node2, null);
      node.parent = root;
      node2.parent = root;
      reduce(root);

      var mag = calcMagnitude(root);
      if (largest == null || mag > largest) largest = mag;
    });
  });

  console.log({ largest });
}

/*
var testData = `[[[[4,3],4],4],[7,[[8,4],9]]]
[1,1]`;

//testData = `[[[[4,3],4],4],[7,[[8,4],9]]]
//[1,1]`;

processTest(testData.split("\n"));

testData = `[1,1]
[2,2]
[3,3]
[4,4]
[5,5]
[6,6]`;

processTest(testData.split("\n"));

testData = `[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
[7,[5,[[3,8],[1,4]]]]
[[2,[2,2]],[8,[8,1]]]
[2,9]
[1,[[[9,3],9],[[9,0],[0,7]]]]
[[[5,[7,4]],7],1]
[[[[4,2],2],6],[8,7]]`;

processTest(testData.split("\n"));

testData = `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`;

processTest(testData.split("\n"));

// Magnitude tests

calcMagnitude(
  numberToTree("[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]")
);
calcMagnitude(numberToTree("[[1,2],[[3,4],5]]"));
calcMagnitude(numberToTree("[[[[0,7],4],[[7,8],[6,0]]],[8,1]]"));
calcMagnitude(numberToTree("[[[[1,1],[2,2]],[3,3]],[4,4]]"));
calcMagnitude(numberToTree("[[[[3,0],[5,3]],[4,4]],[5,5]]"));
calcMagnitude(numberToTree("[[[[5,0],[7,4]],[5,5]],[6,6]]"));
calcMagnitude(
  numberToTree("[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]")
);
calcMagnitude(
  numberToTree("[[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]")
);

*/

var x = document.body.firstChild.textContent.split("\n");
// Remove empty last line
x.splice(x.length - 1, 1);
processTest(x);

var endTime = performance.now();
console.log(`took ${endTime - startTime} ms`);
