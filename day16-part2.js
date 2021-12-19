var startTime = performance.now();

var testInput = `9C0141080250320F1802104A08
`;
var expansion = "";
var stack = [];
var versions = 0;

function processTest(x) {
  expansion = "";
  x[0].split("").forEach((c) => {
    expansion += parseInt(c, 16).toString(2).padStart(4, "0");
  });

  stack = [];
  versions = 0;
  processExpansion(6);

  //console.log({ stack });
  //return;

  //console.log(stack);
  var firstOp = stack.shift();
  var result = processStack(firstOp, stack);

  console.log({ input: x[0], versions, result });
}
function processExpansion(processUntilMaxLength) {
  while (expansion.length >= processUntilMaxLength) {
    //console.log({ expansion });
    var version = parseInt(expansion.substr(0, 3), 2);

    //if (version == 0) {
    //  break;
    //}

    versions = versions + version;
    var packetTypeId = parseInt(expansion.substr(3, 3), 2);

    expansion = expansion.substr(6);

    if (packetTypeId == 4) {
      //console.log("found literal packet");
      var keepGoing;
      var binary = "";
      do {
        keepGoing = expansion.substr(0, 1);
        binary += expansion.substr(1, 4);
        expansion = expansion.substr(5);
      } while (keepGoing == "1");
      stack.push(parseInt(binary, 2));
    } else {
      //console.log("found operator packet");
      var length = expansion.substr(0, 1) == "1" ? 11 : 15;
      var value = parseInt(expansion.substr(1, length), 2);
      expansion = expansion.substr(length + 1);

      if (packetTypeId === 0) stack.push("sum");
      if (packetTypeId === 1) stack.push("product");
      if (packetTypeId === 2) stack.push("min");
      if (packetTypeId === 3) stack.push("max");
      if (packetTypeId === 5) stack.push("gt");
      if (packetTypeId === 6) stack.push("lt");
      if (packetTypeId === 7) stack.push("eq");

      stack.push("(");

      if (packetTypeId >= 5) {
        length = 11;
        value = 2;
      }

      if (length === 15) {
        processExpansion(expansion.length - value + 1);
      } else {
        // value represents number of sub-packets
        // Just continue processing
        for (var i = 0, j = value; i < j; i++) {
          // -1 ensures we should get just 1 instruction
          processExpansion(expansion.length - 1);
        }
      }
      stack.push(")");
    }
  }
}

function processStack(op, stack) {
  //var p = stack.pop();

  // Pop the paren
  //console.log("shift: " + stack.shift());
  stack.shift();

  var nums = [];

  var peek, numeric;
  do {
    peek = stack.shift();
    numeric = !isNaN(+peek);

    if (numeric) {
      nums.push(+peek);
    } else if (peek == ")") {
    } else {
      nums.push(processStack(peek, stack));
    }
  } while (peek != ")");

  if (nums.length == 1) return nums[0];

  if (op == "sum") {
    var sum = 0;
    nums.forEach((n) => {
      sum += n;
    });
    return sum;
  } else if (op == "product") {
    var sum = 1;
    nums.forEach((n) => {
      sum *= n;
    });
    return sum;
  } else if (op == "min") {
    var min = null;
    nums.forEach((n) => {
      if (min == null || n < min) min = n;
    });
    return min;
  } else if (op == "max") {
    var max = null;
    nums.forEach((n) => {
      if (max == null || n > max) max = n;
    });
    return max;
  } else if (op == "lt") {
    return nums[0] < nums[1] ? 1 : 0;
  } else if (op == "gt") {
    return nums[0] > nums[1] ? 1 : 0;
  } else if (op == "eq") {
    return nums[0] == nums[1] ? 1 : 0;
  }

  console.log("ruh roh: " + op);
}

processTest(["C200B40A82"]);
processTest(["04005AC33890"]);
processTest(["880086C3E88112"]);
processTest(["CE00C43D881120"]);
processTest(["D8005AC2A8F0"]);
processTest(["F600BC2D8F"]);
processTest(["9C005AC2F8F0"]);
processTest(["9C0141080250320F1802104A08"]);

var endTime = performance.now();
console.log(`took ${endTime - startTime} ms`);

var x = document.body.firstChild.textContent.split("\n");
//x = testInput.split("\n");
// Remove empty last line
x.splice(x.length - 1, 1);
processTest(x);
