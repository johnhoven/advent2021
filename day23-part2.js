// Below solution does a brute force
// Would be nice to come back and figure out how to graph & Djitska
// What are all edges?  states where vertice is a cost?
// Difficult to visualize how generating the graph is less work
// Still have to generate every state to every other state?
// At 35 seconds for part 2 on 2016 MacBookPro, in Chrome dev tools

var startTime = performance.now();

function inRoom(index) {
  return index > 10;
}

function haveValidValue(index, index4, index3, index2, index1, mod, state) {
  return (
    index == index4 ||
    (index == index3 && state[index4] % 4 == mod) ||
    (index == index2 && state[index3] % 4 == mod && state[index4] % 4 == mod) ||
    (index == index1 &&
      state[index2] % 4 == mod &&
      state[index3] % 4 == mod &&
      state[index4] % 4 == mod)
  );
}

function inRightRoom(state, i, index) {
  var mod = i % 4;
  if (mod == 1 && haveValidValue(index, 12, 23, 19, 11, 1, state)) return true;
  if (mod == 2 && haveValidValue(index, 14, 24, 20, 13, 2, state)) return true;
  if (mod == 3 && haveValidValue(index, 16, 25, 21, 15, 3, state)) return true;
  if (mod == 0 && haveValidValue(index, 18, 26, 22, 17, 0, state)) return true;
}

function roomPossible(state, i, fromIndex) {
  var steps = 0;

  var targetRoom1, targetRoom2, targetRoom3, targetRoom4, entryway, targetMod;
  if (i % 4 == 1) {
    targetRoom1 = 11;
    targetRoom2 = 19;
    targetRoom3 = 23;
    targetRoom4 = 12;
    entryway = 2;
    targetMod = 1;
  } else if (i % 4 == 2) {
    targetRoom1 = 13;
    targetRoom2 = 20;
    targetRoom3 = 24;
    targetRoom4 = 14;
    entryway = 4;
    targetMod = 2;
  } else if (i % 4 == 3) {
    targetRoom1 = 15;
    targetRoom2 = 21;
    targetRoom3 = 25;
    targetRoom4 = 16;
    entryway = 6;
    targetMod = 3;
  } else if (i % 4 == 0) {
    targetRoom1 = 17;
    targetRoom2 = 22;
    targetRoom3 = 26;
    targetRoom4 = 18;
    entryway = 8;
    targetMod = 0;
  }

  var fill1 = state[targetRoom1] > 0;
  if (fill1) return [false, 0, 0];

  var [possible, steps] = pathPossible(state, fromIndex, entryway);
  if (!possible) return [false, 0, 0];

  var fill4 = state[targetRoom4] > 0;
  var fill4Valid = fill4 && state[targetRoom4] % 4 == targetMod;

  var fill3 = state[targetRoom3] > 0;
  var fill3Valid = fill3 && state[targetRoom3] % 4 == targetMod && fill4Valid;

  var fill2 = state[targetRoom2] > 0;
  var fill2Valid = fill2 && state[targetRoom2] % 4 == targetMod && fill3Valid;

  if (!fill1 && fill2Valid) return [true, steps + 1, targetRoom1];
  if (!fill1 && !fill2 && fill3Valid) return [true, steps + 2, targetRoom2];
  if (!fill1 && !fill2 && !fill3 && fill4Valid)
    return [true, steps + 3, targetRoom3];
  if (!fill4) return [true, steps + 4, targetRoom4];

  return [false, 0, 0];
}

function pathPossible(state, index, toIndex) {
  if ((index == 12 || index == 19 || index == 23) && state[11] > 0)
    return [false, 0];
  if ((index == 12 || index == 23) && state[19] > 0) return [false, 0];
  if (index == 12 && state[23] > 0) return [false, 0];

  if ((index == 14 || index == 24 || index == 20) && state[13] > 0)
    return [false, 0];
  if ((index == 14 || index == 24) && state[20] > 0) return [false, 0];
  if (index == 14 && state[24] > 0) return [false, 0];

  if ((index == 16 || index == 25 || index == 21) && state[15] > 0)
    return [false, 0];
  if ((index == 16 || index == 25) && state[21] > 0) return [false, 0];
  if (index == 16 && state[25] > 0) return [false, 0];

  if ((index == 18 || index == 26 || index == 22) && state[17] > 0)
    return [false, 0];
  if ((index == 18 || index == 26) && state[22] > 0) return [false, 0];
  if (index == 18 && state[26] > 0) return [false, 0];

  var start,
    cost,
    skip = -1;
  if (index == 11) {
    start = 2;
    cost = 1;
  } else if (index == 19) {
    start = 2;
    cost = 2;
  } else if (index == 23) {
    start = 2;
    cost = 3;
  } else if (index == 12) {
    start = 2;
    cost = 4;
  } else if (index == 13) {
    start = 4;
    cost = 1;
  } else if (index == 20) {
    start = 4;
    cost = 2;
  } else if (index == 24) {
    start = 4;
    cost = 3;
  } else if (index == 14) {
    start = 4;
    cost = 4;
  } else if (index == 15) {
    start = 6;
    cost = 1;
  } else if (index == 21) {
    start = 6;
    cost = 2;
  } else if (index == 25) {
    start = 6;
    cost = 3;
  } else if (index == 16) {
    start = 6;
    cost = 4;
  } else if (index == 17) {
    start = 8;
    cost = 1;
  } else if (index == 22) {
    start = 8;
    cost = 2;
  } else if (index == 26) {
    start = 8;
    cost = 3;
  } else if (index == 18) {
    start = 8;
    cost = 4;
  } else {
    start = index;
    cost = 0;
    skip = state[index];
  }

  if (start > toIndex) {
    var t = start;
    start = toIndex;
    toIndex = t;
  }

  cost--;
  for (var i = start, j = toIndex; i <= j; i++) {
    if (state[i] > 0 && state[i] != skip) return [false, 0];
    cost++;
  }
  return [true, cost];
}

function quickSum(state) {
  var sum = 0;
  state.forEach((s) => {
    sum += s;
  });

  if (sum != 36 + 9 + 10 + 11 + 12 + 13 + 14 + 15 + 16) debugger;
}

function move(state, i, fromIndex, toIndex, cost, steps) {
  var newState = [...state];
  newState[fromIndex] = 0;
  newState[toIndex] = i;

  if (i % 4 == 1) {
    cost = cost + steps * 1;
  } else if (i % 4 == 2) {
    cost = cost + steps * 10;
  } else if (i % 4 == 3) {
    cost = cost + steps * 100;
  } else if (i % 4 == 0) {
    cost = cost + steps * 1000;
  }

  quickSum(newState);

  return [newState, cost];
}

function Game() {
  //this.initialState = initialState;
  this.pathsTraveled = {};
  this.completePaths = {};
  this.failureStates = {};

  this.minCost = null;

  this.setCost = (path, cost) => {
    this.completePaths[path] = cost;

    if (this.minCost == null || cost < this.minCost) {
      this.minCost = cost;
      console.log(`new min cost: ${cost}`);
    }
  };

  this.isSolved = (state) => {
    return (
      state[11] % 4 == 1 &&
      state[12] % 4 == 1 &&
      state[19] % 4 == 1 &&
      state[23] % 4 == 1 &&
      state[13] % 4 == 2 &&
      state[14] % 4 == 2 &&
      state[20] % 4 == 2 &&
      state[24] % 4 == 2 &&
      state[15] % 4 == 3 &&
      state[16] % 4 == 3 &&
      state[21] % 4 == 3 &&
      state[25] % 4 == 3 &&
      state[17] % 4 == 0 &&
      state[18] % 4 == 0 &&
      state[22] % 4 == 0 &&
      state[26] % 4 == 0 &&
      state[17] != 0 &&
      state[18] != 0 &&
      state[22] != 0 &&
      state[26] != 0
    );
  };

  this.min = () => {
    console.log(`Min: ${this.minCost}`);
  };

  this.step = (path, state, cost) => {
    //if (this.pathsTraveled.hasOwnProperty(path)) return;
    //this.pathsTraveled[path] = true;

    // Short circuit
    if (this.minCost != null && this.minCost < cost) return;
    if (this.failureStates.hasOwnProperty(state.join(""))) return;

    if (this.isSolved(state)) {
      this.setCost(path, cost);
      //this.completePaths[path] = cost;
      return;
    }

    // Just log major branches
    if (path.length <= 4) console.log(path);

    for (var i = 16; i >= 1; i--) {
      if (path == 0) console.log(`working on ${i}`);

      var index = state.findIndex((y) => i == y);

      var room = false;
      if (inRoom(index)) {
        if (inRightRoom(state, i, index)) {
          continue;
        }
        room = true;
      }
      // Try moving to the right room
      var [roomPoss, roomSteps, targetIndex] = roomPossible(state, i, index);
      if (roomPoss) {
        //if (path.length > 75) debugger;
        var [newState, newCost] = move(
          state,
          i,
          index,
          targetIndex,
          cost,
          roomSteps
        );
        this.step(path + "." + i + "." + targetIndex, newState, newCost);
      } else if (room) {
        // Try moving to any valid hallway space
        [0, 1, 3, 5, 7, 9, 10].reverse().forEach((space) => {
          if (path == ".6.10.10.9.13.7" && i == 13 && space == 5) debugger;

          if (index == space) return;

          var [possible, steps] = pathPossible(state, index, space);
          if (possible) {
            var [newState, newCost] = move(state, i, index, space, cost, steps);
            this.step(path + "." + i + "." + space, newState, newCost);
          }
        });
      }
    }
    this.failureStates[state.join(".")] = true;
  };
}

function processTest(initialState) {
  var g = new Game();

  g.step("", initialState, 0);

  //debugger;
  g.min();

  console.log({ g });
}

var testData = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 3, 4, 6, 7, 8, 5, 12, 11, 10, 9, 16,
  14, 13, 15,
];
//processTest(testData);

var puzzleData = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 1, 5, 6, 8, 3, 7, 12, 11, 10, 9, 16,
  14, 13, 15,
];
processTest(puzzleData);

var endTime = performance.now();
console.log(`took ${endTime - startTime} ms`);
