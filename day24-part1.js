// Identified there was a pattern that could diverge when Z % 26 and a negative existed, but don't think I would have made the leap to a stack of base-26 digits
// Ended up reading https://github.com/dphilipson/advent-of-code-2021/blob/master/src/days/day24.rs to understand.
// To further dumb that down, each push multiplies by 26, essentially pushing it to a higher power
// IE if I wanted to stack 7 and then 5 in a base 10 stack at first we'd push 7.
// Then I'd multiply 7 * 10 and add 5 = 75  "75" is in z, but that represents the two digits in my stack.
// To pop, mod and div by 26.  So in our exmaple 75/10 and 75%10 gives us 7 & 5
// 7 goes back onto the stack.
// The key is the equality check so that pops happen everytime we get a negative offset and end with an empty stack (z = 0)

// So for future problems, multiply, divide, mod by a common number probably indicates numbers being manipulated in a power.

// Modified code to print my Check and Offset pairs, manually wrote down my stack and solved each equation for part 1 and part 2.

var checksumsSeen = {};

var startTime = performance.now();

function State() {
  this.w = this.x = this.y = this.z = 0;
}

function runProgram(instr, j, untilDepth, printMemory) {
  var inputs = j.toString();
  if (inputs.match(/0/)) return false;

  inputs = inputs.split("");

  var memory = new State();

  var depth = 1;
  var cancel = false;

  var inputLog = "";
  var loopIndex = 0;
  var check = 0;
  var offset = 0;

  instr.forEach((row) => {
    if (cancel) return;

    var [i, target, ref] = row.split(" ");

    if (i == "inp") {
      loopIndex = 0;

      if (untilDepth != -1 && depth > untilDepth) {
        cancel = true;
        var { w, x, y, z } = memory;
        //console.log(`After ${inputLog} - (${w},${x},${y},${z})`);
        return;
      } else {
        var temp = inputs.shift();

        memory[target] = +temp;
        inputLog += temp;
      }
      depth++;
    } else {
      loopIndex++;

      var refInt = parseInt(ref);
      if (isNaN(refInt)) {
        refInt = memory[ref];
      }

      if (loopIndex == 5) {
        check = +ref;
      } else if (loopIndex == 15) {
        offset = +ref;
        console.log(`check, offset (${check},${offset})`);
      }

      var targetInt = memory[target];
      if (i == "add") {
        memory[target] = targetInt + refInt;
      } else if (i == "mul") {
        memory[target] = targetInt * refInt;
      } else if (i == "div") {
        if (refInt == 0) {
          debugger;
          return false;
        }
        memory[target] = Math.floor(targetInt / refInt);
      } else if (i == "mod") {
        if (targetInt < 0 || refInt <= 0) {
          debugger;
          return false;
        }
        memory[target] = targetInt % refInt;
      } else if (i == "eql") {
        memory[target] = targetInt == refInt ? 1 : 0;
      }
    }
  });

  //console.log(`Input: ${j} checksum ${memory.z}`);

  checksumsSeen[memory.z] = (checksumsSeen[memory.z] || 0) + 1;

  if (memory.z == 0) {
    return true;
  }

  return false;
}

function processTest(instr) {
  // Remove new line
  instr.splice(instr.length - 1, 1);

  if (instr.length <= 1) return;

  for (var j = 11111111111111; j <= 11111111111111; j++) {
    if (runProgram(instr, j, -1, true)) {
      console.log(`result: ${j}`);
      break;
    }
  }
}

var puzzleData = document.body.firstChild.textContent.split("\n");
processTest(puzzleData);

var endTime = performance.now();
console.log(`took ${endTime - startTime} ms`);
