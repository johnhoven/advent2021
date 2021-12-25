var startTime = performance.now();

function inPlane(c1, c2, c3, c4) {
  return (
    (c3 >= c1 && c3 <= c2) || (c4 >= c1 && c4 <= c2) || (c3 <= c1 && c4 >= c2)
  );
}

function haveIntersection(c, coords) {
  return (
    inPlane(c.x1, c.x2, coords.x1, coords.x2) &&
    inPlane(c.y1, c.y2, coords.y1, coords.y2) &&
    inPlane(c.z1, c.z2, coords.z1, coords.z2)
  );
}

function splitCube(iCube, newCube) {
  var newCubes = [];

  // Start with z-plane

  // Do we over lap on the "left"
  if (newCube.z1 < iCube.z1 && newCube.z2 >= iCube.z1) {
    newCubes.push({
      x1: newCube.x1,
      x2: newCube.x2,
      y1: newCube.y1,
      y2: newCube.y2,
      z1: newCube.z1,
      z2: iCube.z1 - 1,
    });

    // Carry over as we may still overlap on the "right"

    newCube = {
      x1: newCube.x1,
      x2: newCube.x2,
      y1: newCube.y1,
      y2: newCube.y2,
      z1: iCube.z1,
      z2: newCube.z2,
    };
  }

  // DO we overlap on the "right?"
  if (newCube.z2 > iCube.z2 && newCube.z1 <= iCube.z2) {
    // Carry over, we may still intersect on another plane
    newCubes.push({
      x1: newCube.x1,
      x2: newCube.x2,
      y1: newCube.y1,
      y2: newCube.y2,
      z1: iCube.z2 + 1,
      z2: newCube.z2,
    });

    newCube = {
      x1: newCube.x1,
      x2: newCube.x2,
      y1: newCube.y1,
      y2: newCube.y2,
      z1: newCube.z1,
      z2: iCube.z2,
    };
  }

  // Repeat for y
  if (newCube.y1 < iCube.y1 && newCube.y2 >= iCube.y1) {
    newCubes.push({
      x1: newCube.x1,
      x2: newCube.x2,
      y1: newCube.y1,
      y2: iCube.y1 - 1,
      z1: newCube.z1,
      z2: newCube.z2,
    });

    // Carry over as we may still overlap on the "right"
    newCube = {
      x1: newCube.x1,
      x2: newCube.x2,
      y1: iCube.y1,
      y2: newCube.y2,
      z1: newCube.z1,
      z2: newCube.z2,
    };
  }

  // DO we overlap on the "right?"
  if (newCube.y2 > iCube.y2 && newCube.y1 <= iCube.y2) {
    // Carry over, we may still intersect on another plane
    newCubes.push({
      x1: newCube.x1,
      x2: newCube.x2,
      y1: iCube.y2 + 1,
      y2: newCube.y2,
      z1: newCube.z1,
      z2: newCube.z2,
    });

    newCube = {
      x1: newCube.x1,
      x2: newCube.x2,
      y1: newCube.y1,
      y2: iCube.y2,
      z1: newCube.z1,
      z2: newCube.z2,
    };
  }

  // Repeat for x
  if (newCube.x1 < iCube.x1 && newCube.x2 >= iCube.x1) {
    newCubes.push({
      x1: newCube.x1,
      x2: iCube.x1 - 1,
      y1: newCube.y1,
      y2: newCube.y2,
      z1: newCube.z1,
      z2: newCube.z2,
    });

    // Carry over as we may still overlap on the "right"
    newCube = {
      x1: iCube.x1,
      x2: newCube.x2,
      y1: newCube.y1,
      y2: newCube.y2,
      z1: newCube.z1,
      z2: newCube.z2,
    };
  }

  // DO we overlap on the "right?"
  if (newCube.x2 > iCube.x2 && newCube.x1 <= iCube.x2) {
    // Carry over, we may still intersect on another plane

    newCubes.push({
      x1: iCube.x2 + 1,
      x2: newCube.x2,
      y1: newCube.y1,
      y2: newCube.y2,
      z1: newCube.z1,
      z2: newCube.z2,
    });

    newCube = {
      x1: newCube.x1,
      x2: iCube.x2,
      y1: newCube.y1,
      y2: newCube.y2,
      z1: newCube.z1,
      z2: newCube.z2,
    };
  }

  // Anything left in newCube is completely overlapping and dropped
  return newCubes;
}
/*
function splitCubeRemoval(removeCube, intCube) {
  var newCubes = [];

  // Start with z-plane

  // Do we over lap on the "left"
  if (intCube.z1 <= removeCube.z1 && intCube.z2 >= removeCube.z1) {
    newCubes.push({
      x1: intCube.x1,
      x2: intCube.x2,
      y1: intCube.y1,
      y2: intCube.y2,
      z1: intCube.z1,
      z2: removeCube.z1 - 1,
    });

    // Carry over as we may still overlap on the "right"

    intCube = {
      x1: intCube.x1,
      x2: intCube.x2,
      y1: intCube.y1,
      y2: intCube.y2,
      z1: removeCube.z1,
      z2: intCube.z2,
    };
  }

  // DO we overlap on the "right?"
  if (intCube.z2 >= removeCube.z2 && intCube.z1 <= removeCube.z2) {
    // Carry over, we may still intersect on another plane
    newCubes.push({
      x1: intCube.x1,
      x2: intCube.x2,
      y1: intCube.y1,
      y2: intCube.y2,
      z1: removeCube.z2 + 1,
      z2: intCube.z2,
    });

    intCube = {
      x1: intCube.x1,
      x2: intCube.x2,
      y1: intCube.y1,
      y2: intCube.y2,
      z1: intCube.z1,
      z2: removeCube.z2,
    };
  }

  // Repeat for y
  if (intCube.y1 <= removeCube.y1 && intCube.y2 >= removeCube.y1) {
    newCubes.push({
      x1: intCube.x1,
      x2: intCube.x2,
      y1: intCube.y1,
      y2: removeCube.y1 - 1,
      z1: intCube.z1,
      z2: intCube.z2,
    });

    // Carry over as we may still overlap on the "right"
    intCube = {
      x1: intCube.x1,
      x2: intCube.x2,
      y1: removeCube.y1,
      y2: intCube.y2,
      z1: intCube.z1,
      z2: intCube.z2,
    };
  }

  // DO we overlap on the "right?"
  if (intCube.y2 >= removeCube.y2 && intCube.y1 <= removeCube.y2) {
    // Carry over, we may still intersect on another plane
    newCubes.push({
      x1: intCube.x1,
      x2: intCube.x2,
      y1: removeCube.y2 + 1,
      y2: intCube.y2,
      z1: intCube.z1,
      z2: intCube.z2,
    });

    intCube = {
      x1: intCube.x1,
      x2: intCube.x2,
      y1: intCube.y1,
      y2: removeCube.y2,
      z1: intCube.z1,
      z2: intCube.z2,
    };
  }

  // Repeat for x
  if (intCube.x1 <= removeCube.x1 && intCube.x2 >= removeCube.x1) {
    newCubes.push({
      x1: intCube.x1,
      x2: removeCube.x1 - 1,
      y1: intCube.y1,
      y2: intCube.y2,
      z1: intCube.z1,
      z2: intCube.z2,
    });

    // Carry over as we may still overlap on the "right"
    intCube = {
      x1: removeCube.x1,
      x2: intCube.x2,
      y1: intCube.y1,
      y2: intCube.y2,
      z1: intCube.z1,
      z2: intCube.z2,
    };
  }

  // DO we overlap on the "right?"
  if (intCube.x2 >= removeCube.x2 && intCube.x1 <= removeCube.x2) {
    // Carry over, we may still intersect on another plane

    newCubes.push({
      x1: removeCube.x2 + 1,
      x2: intCube.x2,
      y1: intCube.y1,
      y2: intCube.y2,
      z1: intCube.z1,
      z2: intCube.z2,
    });

    intCube = {
      x1: intCube.x1,
      x2: removeCube.x2,
      y1: intCube.y1,
      y2: intCube.y2,
      z1: intCube.z1,
      z2: intCube.z2,
    };
  }

  // Anything left in newCube is completely overlapping and dropped
  return newCubes;
}
*/

function cubeUnionizer() {
  this.cubes = [];

  this.findIntersect = (coords) => {
    var result = [];
    this.cubes.forEach((c) => {
      if (c == coords) return;

      if (haveIntersection(c, coords)) {
        result.push(c);
      }
    });

    return result;
  };

  this.addCube = (coords) => {
    var cubesToAdd = [coords];
    while (cubesToAdd.length) {
      var cube = cubesToAdd.shift();

      var intersects = this.findIntersect(cube);
      if (intersects.length) {
        cubesToAdd = cubesToAdd.concat(splitCube(intersects[0], cube));
        continue;
      }

      this.cubes.push(cube);
    }

    this.count("Add");
  };

  this.count = (operation) => {
    var c = 0;

    this.cubes.forEach((cu) => {
      c += (cu.x2 - cu.x1 + 1) * (cu.y2 - cu.y1 + 1) * (cu.z2 - cu.z1 + 1);
    });

    console.log(`After ${operation} - Count: ${c}`);
    this.checkOverlaps();
  };

  this.removeCube = (cords) => {
    //var cubesToRemove = [coords];
    //while (cubesToRemove.length) {
    //var cube = cubesToRemove.shift();

    var cubesToSave = [];
    //debugger;

    var intersects = this.findIntersect(cords);
    intersects.forEach((int) => {
      cubesToSave = cubesToSave.concat(splitCube(cords, int));

      var index = this.cubes.findIndex((int2) => {
        return int2 == int;
      });
      if (index == -1) debugger;
      this.cubes.splice(index, 1);
    });

    this.cubes = this.cubes.concat(cubesToSave);

    this.count("Remove");
  };

  this.checkOverlaps = () => {
    this.cubes.forEach((c) => {
      if (this.findIntersect(c).length) {
        debugger;
      }
    });
  };
}

function processLine(line, cubeU) {
  var [onOffFlag, instructions] = line.split(" ");
  var [x, y, z] = instructions.split(",");
  [x1, x2] = x
    .substr(2)
    .split("..")
    .map((n) => +n);
  [y1, y2] = y
    .substr(2)
    .split("..")
    .map((n) => +n);
  [z1, z2] = z
    .substr(2)
    .split("..")
    .map((n) => +n);

  // Checking for any tricky partial ranges for part 1
  if (
    -50 >= x1 &&
    -50 >= y1 &&
    -50 >= z1 &&
    -50 <= x2 &&
    -50 <= y2 &&
    -50 <= z2
  ) {
    // Any that
    debugger;
  } else if (
    50 >= x1 &&
    50 >= y1 &&
    50 >= z1 &&
    50 <= x2 &&
    50 <= y2 &&
    50 <= z2
  ) {
    // Any that
    debugger;
  } else if (
    -50 <= x1 &&
    50 >= x2 &&
    -50 <= y1 &&
    50 >= y2 &&
    -50 <= z1 &&
    50 >= z2
  ) {
    console.log({ onOffFlag, x1, x2, y1, y2, z1, z2 });

    var coords = { x1, x2, y1, y2, z1, z2 };
    if (onOffFlag == "on") {
      cubeU.addCube(coords);
    } else {
      cubeU.removeCube(coords);
    }
  }
}

function processTest(x) {
  // Remove empty last line
  x.splice(x.length - 1, 1);
  if (x.length <= 1) return;

  var cubeU = new cubeUnionizer();

  x.forEach((line) => {
    processLine(line, cubeU);
  });

  console.log(cubeU);

  //console.log(result);
}

var testData = `on x=10..12,y=10..12,z=10..12
on x=11..13,y=11..13,z=11..13
off x=9..11,y=9..11,z=9..11
on x=10..10,y=10..10,z=10..10
`;

processTest(testData.split("\n"));

testData = `on x=-20..26,y=-36..17,z=-47..7
on x=-20..33,y=-21..23,z=-26..28
on x=-22..28,y=-29..23,z=-38..16
on x=-46..7,y=-6..46,z=-50..-1
on x=-49..1,y=-3..46,z=-24..28
on x=2..47,y=-22..22,z=-23..27
on x=-27..23,y=-28..26,z=-21..29
on x=-39..5,y=-6..47,z=-3..44
on x=-30..21,y=-8..43,z=-13..34
on x=-22..26,y=-27..20,z=-29..19
off x=-48..-32,y=26..41,z=-47..-37
on x=-12..35,y=6..50,z=-50..-2
off x=-48..-32,y=-32..-16,z=-15..-5
on x=-18..26,y=-33..15,z=-7..46
off x=-40..-22,y=-38..-28,z=23..41
on x=-16..35,y=-41..10,z=-47..6
off x=-32..-23,y=11..30,z=-14..3
on x=-49..-5,y=-3..45,z=-29..18
off x=18..30,y=-20..-8,z=-3..13
on x=-41..9,y=-7..43,z=-33..15
on x=-54112..-39298,y=-85059..-49293,z=-27449..7877
on x=967..23432,y=45373..81175,z=27513..53682`;

console.log("------------- TEST 2--------------");
processTest(testData.split("\n"));

var x = document.body.firstChild.textContent.split("\n");
processTest(x);

var endTime = performance.now();
console.log(`took ${endTime - startTime} ms`);
