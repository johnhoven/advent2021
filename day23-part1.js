var startTime = performance.now();

function inRoom(index) {
  return index > 10;
}

function inRightRoom(state, i, index) {
  // 11  13  15  17
  // 12  14  16  18

  var mod = i % 4;
  if (mod == 1 && (index == 12 || (index == 11 && state[12] % 4 == 1)))
    return true;

  if (mod == 2 && (index == 14 || (index == 13 && state[14] % 4 == 2)))
    return true;

  if (mod == 3 && (index == 16 || (index == 15 && state[16] % 4 == 3)))
    return true;

  if (mod == 0 && (index == 18 || (index == 17 && state[18] % 4 == 0)))
    return true;
}

function roomPossible(state, i, fromIndex) {
  var steps = 0;

  var targetRoom1, targetRoom2, entryway, targetMod;
  if (i % 4 == 1) {
    targetRoom1 = 11;
    targetRoom2 = 12;
    entryway = 2;
    targetMod = 1;
  } else if (i % 4 == 2) {
    targetRoom1 = 13;
    targetRoom2 = 14;
    entryway = 4;
    targetMod = 2;
  } else if (i % 4 == 3) {
    targetRoom1 = 15;
    targetRoom2 = 16;
    entryway = 6;
    targetMod = 3;
  } else if (i % 4 == 0) {
    targetRoom1 = 17;
    targetRoom2 = 18;
    entryway = 8;
    targetMod = 0;
  }

  if (state[targetRoom1] > 0) return [false, 0, 0];

  if (state[targetRoom2] == 0) {
    var [possible, steps] = pathPossible(state, fromIndex, entryway);
    if (!possible) return [false, 0, 0];

    return [true, steps + 2, targetRoom2];
  }

  if (state[targetRoom2] > 0 && state[targetRoom2] % 4 == targetMod) {
    var [possible, steps] = pathPossible(state, fromIndex, entryway);
    if (!possible) return [false, 0, 0];

    return [true, steps + 1, targetRoom1];
  }

  return [false, 0, 0];
}

function pathPossible(state, index, toIndex) {
  if (index == 12 && state[11] > 0) return [false, 0];
  if (index == 14 && state[13] > 0) return [false, 0];
  if (index == 16 && state[15] > 0) return [false, 0];
  if (index == 18 && state[17] > 0) return [false, 0];

  var start,
    cost,
    skip = -1;
  if (index == 12) {
    start = 2;
    cost = 2;
  } else if (index == 11) {
    start = 2;
    cost = 1;
  } else if (index == 13) {
    start = 4;
    cost = 1;
  } else if (index == 14) {
    start = 4;
    cost = 2;
  } else if (index == 15) {
    start = 6;
    cost = 1;
  } else if (index == 16) {
    start = 6;
    cost = 2;
  } else if (index == 17) {
    start = 8;
    cost = 1;
  } else if (index == 18) {
    start = 8;
    cost = 2;
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

  if (sum != 36) debugger;
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

  this.minCost = null;

  this.setCost = (path, cost) => {
    this.completePaths[path] = cost;

    if (this.minCost == null || cost < this.minCost) {
      this.minCost = cost;
    }
  };

  this.isSolved = (state) => {
    // 11  13  15  17
    // 12  14  16  18
    return (
      state[11] % 4 == 1 &&
      state[12] % 4 == 1 &&
      state[13] % 4 == 2 &&
      state[14] % 4 == 2 &&
      state[15] % 4 == 3 &&
      state[16] % 4 == 3 &&
      state[17] % 4 == 0 &&
      state[18] % 4 == 0 &&
      state[17] != 0 &&
      state[18] != 0
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

    if (this.isSolved(state)) {
      this.setCost(path, cost);
      //this.completePaths[path] = cost;
      return;
    }

    for (var i = 1; i <= 8; i++) {
      if (path == 0) console.log(`working on ${i}`);

      var index = state.findIndex((y) => i == y);

      if (inRoom(index)) {
        if (inRightRoom(state, i, index)) {
          continue;
        }

        // Try moving to any valid hallway space
        [0, 1, 3, 5, 7, 9, 10].forEach((space) => {
          var [possible, steps] = pathPossible(state, index, space);
          if (possible) {
            var [newState, newCost] = move(state, i, index, space, cost, steps);
            this.step(path + "." + i + "." + space, newState, newCost);
          }
        });
      }

      // Try moving to the right room
      if (path == ".6.3.3.15.4.5.6.14.2.13.8.7.5.9" && i == 8) debugger;
      var [roomPoss, roomSteps, targetIndex] = roomPossible(state, i, index);
      if (roomPoss) {
        var [newState, newCost] = move(
          state,
          i,
          index,
          targetIndex,
          cost,
          roomSteps
        );
        this.step(path + "." + i + "." + targetIndex, newState, newCost);
      }
    }
  };
}

function processTest(initialState) {
  var g = new Game();

  g.step("", initialState, 0);

  //debugger;
  g.min();

  console.log({ g });
}

var testData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 3, 4, 6, 7, 8, 5];
//processTest(testData);

var puzzleData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 1, 5, 6, 8, 3, 7];
processTest(puzzleData);

var endTime = performance.now();
console.log(`took ${endTime - startTime} ms`);
