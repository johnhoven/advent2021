var startTime = performance.now();

var transformsUsed = [];
var stations = [];

function addEdge2(d, key, b2) {
  var o = d[key] || 1;
  d[key] = o;
  //o[b2] = true;
}

function swap(a, b) {
  return [a, b];
}

function bigSwap(a, b, c) {
  return [a, b, c];
}

function realign(targetBeacon, transformNo) {
  var x2 = targetBeacon.p1;
  var y2 = targetBeacon.p2;
  var z2 = targetBeacon.p3;

  if (
    transformNo > 23 &&
    transformNo != 35 &&
    transformNo != 28 &&
    transformNo != 46 &&
    transformNo != 25 &&
    transformNo != 39 &&
    transformNo != 45 &&
    transformNo != 47
  ) {
    debugger;
  }

  transformsUsed[transformNo] = true;

  switch (transformNo) {
    case 1:
      [x2, y2, z2] = bigSwap(x2, -z2, y2);
      break;

    case 2:
      [x2, y2, z2] = bigSwap(x2, -y2, -z2);
      break;

    case 3:
      [x2, y2, z2] = bigSwap(x2, z2, -y2);
      break;

    case 4:
      [x2, y2, z2] = bigSwap(-x2, -y2, z2);
      break;

    case 5:
      [x2, y2, z2] = bigSwap(-x2, -z2, -y2);
      break;

    case 6:
      [x2, y2, z2] = bigSwap(-x2, y2, -z2);
      break;

    case 7:
      [x2, y2, z2] = bigSwap(-x2, z2, y2);
      break;

    case 8:
      [x2, y2, z2] = bigSwap(y2, x2, -z2);
      break;

    case 9:
      [x2, y2, z2] = bigSwap(y2, -x2, z2);
      break;

    case 10:
      [x2, y2, z2] = bigSwap(y2, z2, x2);
      break;

    case 11:
      [x2, y2, z2] = bigSwap(y2, z2, -x2);
      break;

    case 12:
      [x2, y2, z2] = bigSwap(-y2, x2, z2);
      break;

    case 13:
      [x2, y2, z2] = bigSwap(-y2, -z2, x2);
      break;

    case 14:
      [x2, y2, z2] = bigSwap(-y2, -x2, -z2);
      break;

    case 15:
      [x2, y2, z2] = bigSwap(-y2, z2, -x2);
      break;

    case 16:
      [x2, y2, z2] = bigSwap(z2, x2, y2);
      break;

    case 17:
      [x2, y2, z2] = bigSwap(z2, y2, -x2);
      break;

    case 18:
      [x2, y2, z2] = bigSwap(z2, -x2, -y2);
      break;

    case 19:
      [x2, y2, z2] = bigSwap(z2, -y2, x2);
      break;

    case 20:
      [x2, y2, z2] = bigSwap(-z2, y2, x2);
      break;

    case 21:
      [x2, y2, z2] = bigSwap(-z2, -x2, -y2);
      break;

    case 22:
      [x2, y2, z2] = bigSwap(-z2, -y2, -x2);
      break;

    case 23:
      [x2, y2, z2] = bigSwap(z2, x2, y2);
      break;

    case 35:
      [x2, y2, z2] = bigSwap(y2, -z2, -x2);
      break;

    case 28:
      [x2, y2, z2] = bigSwap(-x2, -y2, -z2);
      break;

    case 46:
      [x2, y2, z2] = bigSwap(-z2, -y2, x2);
      break;

    case 25:
      [x2, y2, z2] = bigSwap(x2, y2, -z2);
      break;

    case 39:
      [x2, y2, z2] = bigSwap(-y2, z2, x2);
      break;
    case 45:
      [x2, y2, z2] = bigSwap(-z2, -x2, y2);
      break;
    case 47:
      [x2, y2, z2] = bigSwap(-z2, x2, -y2);
      break;
  }

  return [x2, y2, z2];
}

function Beacon(line) {
  var [p1, p2, p3] = line.split(",");
  this.p1 = +p1;
  this.p2 = +p2;
  this.p3 = +p3;
  this.initialized = false;

  this.distances = [];

  //line.split(',').map(p => Math.abs(+p)).sort((a,b) => a-b).join(',');
  this.initialize = (scanner, i) => {
    if (!this.initialized || true) {
      this.initialized = true;

      var b1 = this;
      b1.distances = {};
      scanner.Beacons.forEach((b2, b2i) => {
        if (b1 == b2) return;

        var pt1 = b1.p1 - b2.p1;
        var pt2 = b1.p2 - b2.p2;
        var pt3 = b1.p3 - b2.p3;

        var dist = Math.sqrt(pt1 * pt1 + pt2 * pt2 + pt3 * pt3);
        b1.distances[dist] = true;
      });
    }
  };

  this.prepareForMerge = (scanner, onlyZero) => {
    var b1 = this;
    //scanner.Beacons.forEach((b1) => {
    b1.transforms = [];
    for (var i = 0, j = 48; i < j; i++) {
      b1.transforms[i] = {};
    }

    scanner.Beacons.forEach((b2, b2i) => {
      if (b1 == b2) return;

      var pt1 = b1.p1 - b2.p1;
      var pt2 = b1.p2 - b2.p2;
      var pt3 = b1.p3 - b2.p3;

      addEdge2(b1.transforms[0], `${pt1}.${pt2}.${pt3}`, b2i);

      if (!onlyZero) {
        addEdge2(b1.transforms[1], `${pt1}.${-pt3}.${pt2}`, b2i);
        addEdge2(b1.transforms[2], `${pt1}.${-pt2}.${-pt3}`, b2i);
        addEdge2(b1.transforms[3], `${pt1}.${pt3}.${-pt2}`, b2i);

        addEdge2(b1.transforms[4], `${-pt1}.${-pt2}.${pt3}`, b2i);
        addEdge2(b1.transforms[5], `${-pt1}.${-pt3}.${-pt2}`, b2i);
        addEdge2(b1.transforms[6], `${-pt1}.${pt2}.${-pt3}`, b2i);
        addEdge2(b1.transforms[7], `${-pt1}.${pt3}.${pt2}`, b2i);

        addEdge2(b1.transforms[8], `${pt2}.${pt1}.${-pt3}`, b2i); // Updated
        addEdge2(b1.transforms[9], `${pt2}.${-pt1}.${pt3}`, b2i); // Updated
        addEdge2(b1.transforms[10], `${pt2}.${pt3}.${pt1}`, b2i); // Updated
        addEdge2(b1.transforms[11], `${pt2}.${pt3}.${-pt1}`, b2i); // Updated

        addEdge2(b1.transforms[12], `${-pt2}.${pt1}.${pt3}`, b2i);
        addEdge2(b1.transforms[13], `${-pt2}.${-pt3}.${pt1}`, b2i);
        addEdge2(b1.transforms[14], `${-pt2}.${-pt1}.${-pt3}`, b2i);
        addEdge2(b1.transforms[15], `${-pt2}.${pt3}.${-pt1}`, b2i);

        addEdge2(b1.transforms[16], `${pt3}.${pt1}.${pt2}`, b2i);
        addEdge2(b1.transforms[17], `${pt3}.${pt2}.${-pt1}`, b2i);
        addEdge2(b1.transforms[18], `${pt3}.${-pt1}.${-pt2}`, b2i);
        addEdge2(b1.transforms[19], `${pt3}.${-pt2}.${pt1}`, b2i);

        addEdge2(b1.transforms[20], `${-pt3}.${pt2}.${pt1}`, b2i);
        addEdge2(b1.transforms[21], `${-pt3}.${-pt1}.${-pt2}`, b2i);
        addEdge2(b1.transforms[22], `${-pt3}.${-pt2}.${-pt1}`, b2i);
        addEdge2(b1.transforms[23], `${-pt3}.${pt1}.${pt2}`, b2i); // Updated

        addEdge2(b1.transforms[24], `${pt1}.${-pt2}.${pt3}`, b2i);
        addEdge2(b1.transforms[25], `${pt1}.${pt2}.${-pt3}`, b2i);
        addEdge2(b1.transforms[26], `${pt1}.${-pt3}.${-pt2}`, b2i);
        addEdge2(b1.transforms[27], `${pt1}.${pt3}.${pt2}`, b2i);

        addEdge2(b1.transforms[28], `${-pt1}.${-pt2}.${-pt3}`, b2i);
        addEdge2(b1.transforms[29], `${-pt1}.${pt2}.${pt3}`, b2i);
        addEdge2(b1.transforms[30], `${-pt1}.${-pt3}.${pt2}`, b2i);
        addEdge2(b1.transforms[31], `${-pt1}.${pt3}.${-pt2}`, b2i);

        addEdge2(b1.transforms[32], `${pt2}.${-pt1}.${-pt3}`, b2i);
        addEdge2(b1.transforms[33], `${pt2}.${-pt3}.${pt1}`, b2i);
        addEdge2(b1.transforms[34], `${pt2}.${pt1}.${pt3}`, b2i);
        addEdge2(b1.transforms[35], `${pt2}.${-pt3}.${-pt1}`, b2i);

        addEdge2(b1.transforms[36], `${-pt2}.${pt1}.${-pt3}`, b2i);
        addEdge2(b1.transforms[37], `${-pt2}.${-pt3}.${-pt1}`, b2i);
        addEdge2(b1.transforms[38], `${-pt2}.${-pt1}.${pt3}`, b2i);
        addEdge2(b1.transforms[39], `${-pt2}.${pt3}.${pt1}`, b2i);

        addEdge2(b1.transforms[40], `${pt3}.${pt1}.${-pt2}`, b2i);
        addEdge2(b1.transforms[41], `${pt3}.${pt2}.${pt1}`, b2i);
        addEdge2(b1.transforms[42], `${pt3}.${-pt1}.${pt2}`, b2i);
        addEdge2(b1.transforms[43], `${pt3}.${-pt2}.${-pt1}`, b2i);

        addEdge2(b1.transforms[44], `${-pt3}.${pt2}.${-pt1}`, b2i);
        addEdge2(b1.transforms[45], `${-pt3}.${-pt1}.${pt2}`, b2i);
        addEdge2(b1.transforms[46], `${-pt3}.${-pt2}.${pt1}`, b2i);
        addEdge2(b1.transforms[47], `${-pt3}.${pt1}.${-pt2}`, b2i);
      }
    });
    //  });
  };
}

function Scanner(num) {
  this.Beacons = [];
  this.BeaconsTrack = {};
  this.merged = false;
  //this.initialized = false;
  this.scanNo = num;

  this.areAligned = (scannerY, extraDebug) => {
    // Can we find 12 items that overlap by their relative positions?

    //if (!this.initialized) {
    //  this.initialize();
    //}

    //if (!scannerY.initialized) {
    //  scannerY.initialize();
    //}

    // This is flawed.  We're asking if we match enough vertices (by distance between beacons).  Get count of beacons (edges) for those vertices.
    // Flaw/assumption is there wouldn't be similar distance between
    // separate beacons.
    // What to do instead?

    // Loop starting on beacon 1.  Are 11 other beacons found in scanner 2 with the same offsets from beacon 1?  Don't forget we have to consider all orientations.  No?  Move on to Beacon 2 to end..
    // Yes?  We now have a connected configuration which overlaps
    // We can use any overlapping beacon to determine offset from S1 to S2
    // Find unoverlapped beacons, translate offset from S2 to S1 relative,
    // add to S1 beacon list.

    var sourceBeacon, targetBeacon;
    var scannerX = this;

    var found = this.Beacons.some((b1, b1i) => {
      if (!b1.initialized) {
        b1.initialize(scannerX, 0);
      }

      var res = scannerY.Beacons.some((b2, b2i) => {
        //if (!b2.initialized) {
        //  b2.initialize(scannerY);
        //}

        // Compare b1 and b2
        var iRes = [0].some((i) => {
          return [
            0,
            //0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            //19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, //35,
            //36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
          ].some((j) => {
            var matches = 1;
            var matchDistances = [];

            b2.initialize(scannerY, j);

            for (var b1x in b1.distances) {
              if (b2.distances.hasOwnProperty(b1x)) {
                matches++;
                //matchDistances.push(b1x);
              }
            }

            //b2.distances[j] = [];

            if (matches >= 12) {
              //console.log(
              //  `Found 12 matches on scanner ${this.scanNo} to ${scannerY.//scanNo} - total ${matches}`
              //);

              sourceBeacon = b1;
              targetBeacon = b2;

              return true;
            }

            return false;
          });
        });

        //b2.distances = [];
        //b2.initialized = false;

        return iRes;
      });

      return res;
    });

    if (found) {
      return [true, sourceBeacon, targetBeacon];
    }

    return [false, null, null, null, null];
  };

  this.getTransform = (scannerY) => {
    var s = this;
    var transformNo = -1;

    //this.prepareForMerge(this, true);
    var searchResult = this.Beacons.some((b1) => {
      b1.prepareForMerge(s, true);

      var result = scannerY.Beacons.some((b2) => {
        b2.prepareForMerge(scannerY, false);
        for (var i = 0, j = 48; i < j; i++) {
          var matches = 1;
          for (var x in b1.transforms[0]) {
            if (b2.transforms[i].hasOwnProperty(x)) {
              matches++;
              if (matches >= 12) {
                transformNo = i;
                //console.log(
                //  `found transformation from ${s.scanNo} to ${scannerY.scanNo} on orientation #${i}! `
                //);
                return true;
              }
            }
          }
        }
      });

      if (result) return true;
    });

    if (!searchResult) {
      console.log(":(");
      return -1;
    }

    return transformNo;
  };

  this.mergeIn = (scannerY, sourceBeacon, targetBeacon) => {
    var scannerX = this;

    // sourceBeacon.pt1/2/3 are relative to scannerX
    // targetBeacon.pt1/2/3 are relative to scannerY

    var transformNo = this.getTransform(scannerY);
    if (transformNo == -1) return false;

    scannerY.merged = true;
    console.log(
      `scanner ${this.scanNo} has ${this.Beacons.length} beacons before merge.`
    );

    //if (scannerY.scanNo == 4 || scannerY.scanNo == 29) debugger;

    var [x2, y2, z2] = realign(targetBeacon, transformNo);

    // We now have the x2, y2, z2 arranged the same as the source beacon's orientation

    var xOffset = sourceBeacon.p1 - x2;
    var yOffset = sourceBeacon.p2 - y2;
    var zOffset = sourceBeacon.p3 - z2;

    scannerY.offSets = { x: xOffset, y: yOffset, z: zOffset };
    scannerY.mergedFrom = scannerX;
    scannerX.mergedIn = scannerX.mergedIn || [];
    scannerX.mergedIn.push(scannerY);
    scannerX.stations = scannerX.stations || [];
    // At end, loop over mergedIn pushing offsets down stream so all
    // offsets normalize relative to scanner0.

    stations.push({ x: xOffset, y: yOffset, z: zOffset });

    console.log(
      `Scan ${scannerY.scanNo}, Relative to ${scannerX.scanNo} = : (${xOffset}, ${yOffset}, ${zOffset})`
    );
    var added = 0;

    scannerY.Beacons.forEach((b) => {
      var [x3, y3, z3] = realign(b, transformNo);

      var key = `${x3 + xOffset},${y3 + yOffset},${z3 + zOffset}`;
      if (!scannerX.BeaconsTrack.hasOwnProperty(key)) {
        scannerX.Beacons.push(new Beacon(key));
        scannerX.BeaconsTrack[key] = true;
        added++;
      } else {
        //console.log("duplicate beacon (expected to an extend)");
      }
    });

    var key = `${xOffset},${yOffset},${zOffset}`;
    scannerX.stations.push(new Beacon(key));

    scannerY.stations &&
      scannerY.stations.forEach((b) => {
        var [x3, y3, z3] = realign(b, transformNo);
        var key = `${x3 + xOffset},${y3 + yOffset},${z3 + zOffset}`;
        scannerX.stations.push(new Beacon(key));
      });

    console.log(
      `scanner ${this.scanNo} has ${added} added from ${scannerY.scanNo}.`
    );

    scannerX.Beacons.forEach((b) => {
      b.initialized = false;
      b.distances = [];
      b.transforms = [];
    });

    scannerY.Beacons = [];
    scannerY.BeaconsTrack = null;

    return true;
  };
}

var scanners = [];

function calculateManhattanDistanceThree() {
  var scanner = scanners.find((s) => !s.merged);

  var selfBeacon = new Beacon(`0,0,0`);
  scanner.stations.push(selfBeacon);

  var max = null;
  scanner.stations.forEach((scanA, aIn) => {
    scanner.stations.forEach((scanB, bIn) => {
      if (scanA == scanB) return;

      var a = scanA;
      var b = scanB;

      var x = Math.abs(a.p1 - b.p1);
      var y = Math.abs(a.p2 - b.p2);
      var z = Math.abs(a.p3 - b.p3);
      var man = x + y + z;

      if (max == null || man > max) {
        max = man;
      }
    });
  });

  console.log(`Manhattan Distance is ${max}`);
}

function processTest(x) {
  var scannerNo = -1;
  var scanner = null;
  stations = [];
  transformsUsed = [];
  stations.push({ x: 0, y: 0, z: 0 });

  x.forEach((line) => {
    if (line.match("---")) {
      scannerNo++;
      scanner = new Scanner(scannerNo);
      scanners[scannerNo] = scanner;
    } else if (line == "") {
    } else {
      scanner.Beacons.push(new Beacon(line));
      scanner.BeaconsTrack[line] = true;
    }
  });

  // Try to get a different result
  //scanners.reverse();

  var unmergedScanners = 0;
  var any = false;
  do {
    any = false;
    // Merge Nodes
    scanners.forEach((scannerX) => {
      if (scannerX.merged) return;

      scanners.forEach((scannerY) => {
        if (scannerX == scannerY) return;
        if (scannerY.merged || scannerY.scanNo == 0) return;

        //console.log(`checking ${scannerX.scanNo} to ${scannerY.scanNo}`);
        var [aligned, sourceBeacon, targetBeacon] = scannerX.areAligned(
          scannerY,
          !any ? true : false
        );
        if (aligned) {
          any |= scannerX.mergeIn(scannerY, sourceBeacon, targetBeacon);
        }
      });
    });

    unmergedScanners = 0;
    scanners.forEach((scanner) => {
      if (!scanner.merged) unmergedScanners++;
    });
    console.log(`unmerged scanners: ${unmergedScanners}`);
  } while (unmergedScanners > 1 && any);

  calculateManhattanDistanceThree();
}

var testData = `--- scanner 0 ---
404,-588,-901
528,-643,409
-838,591,734
390,-675,-793
-537,-823,-458
-485,-357,347
-345,-311,381
-661,-816,-575
-876,649,763
-618,-824,-621
553,345,-567
474,580,667
-447,-329,318
-584,868,-557
544,-627,-890
564,392,-477
455,729,728
-892,524,684
-689,845,-530
423,-701,434
7,-33,-71
630,319,-379
443,580,662
-789,900,-551
459,-707,401

--- scanner 1 ---
686,422,578
605,423,415
515,917,-361
-336,658,858
95,138,22
-476,619,847
-340,-569,-846
567,-361,727
-460,603,-452
669,-402,600
729,430,532
-500,-761,534
-322,571,750
-466,-666,-811
-429,-592,574
-355,545,-477
703,-491,-529
-328,-685,520
413,935,-424
-391,539,-444
586,-435,557
-364,-763,-893
807,-499,-711
755,-354,-619
553,889,-390

--- scanner 2 ---
649,640,665
682,-795,504
-784,533,-524
-644,584,-595
-588,-843,648
-30,6,44
-674,560,763
500,723,-460
609,671,-379
-555,-800,653
-675,-892,-343
697,-426,-610
578,704,681
493,664,-388
-671,-858,530
-667,343,800
571,-461,-707
-138,-166,112
-889,563,-600
646,-828,498
640,759,510
-630,509,768
-681,-892,-333
673,-379,-804
-742,-814,-386
577,-820,562

--- scanner 3 ---
-589,542,597
605,-692,669
-500,565,-823
-660,373,557
-458,-679,-417
-488,449,543
-626,468,-788
338,-750,-386
528,-832,-391
562,-778,733
-938,-730,414
543,643,-506
-524,371,-870
407,773,750
-104,29,83
378,-903,-323
-778,-728,485
426,699,580
-438,-605,-362
-469,-447,-387
509,732,623
647,635,-688
-868,-804,481
614,-800,639
595,780,-596

--- scanner 4 ---
727,592,562
-293,-554,779
441,611,-461
-714,465,-776
-743,427,-804
-660,-479,-426
832,-632,460
927,-485,-438
408,393,-506
466,436,-512
110,16,151
-258,-428,682
-393,719,612
-211,-452,876
808,-476,-593
-575,615,604
-485,667,467
-680,325,-822
-627,-443,-432
872,-547,-609
833,512,582
807,604,487
839,-516,451
891,-625,532
-652,-548,-490
30,-46,-14`;

//processTest(testData.split("\n"));

var x = document.body.firstChild.textContent.split("\n");
// Remove empty last line
x.splice(x.length - 1, 1);
processTest(x);

var endTime = performance.now();
console.log(`took ${endTime - startTime} ms`);

/*
scanners[0].Beacons.sort((a, b) => {
  return a.p1 == b.p1 && a.p2 == b.p2
    ? b.p3 - a.p3
    : a.p1 == b.p1
    ? b.p2 - a.p2
    : b.p1 - a.p1;
})
  .reverse()
  .map((b) => {
    return `${b.p1},${b.p2},${b.p3}`;
  })
  .join("\n");
*/

// X, Y X
// rotate -> y and z flip
// rotate -> y and z flip, both negate

// At least 3 of the 4 of: 11, 20, 21, and 23 are likely invalid transformations incorrect
// 35, 45, and 47 were used in a successful result.
