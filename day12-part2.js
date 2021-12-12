var startTime = performance.now();

var testInput = `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW
`;

var x = document.body.firstChild.textContent.split("\n");
x = testInput.split("\n");

x.splice(x.length - 1, 1);

function isUpper(cave) {
  var char = cave.charAt(0);
  return char >= "A" && char <= "Z";
}

var caveMap = {};

x.forEach((tunnel, lineNo) => {
  var [start, end] = tunnel.split("-");
  if (!caveMap.hasOwnProperty(start)) caveMap[start] = [];

  if (!caveMap.hasOwnProperty(end)) caveMap[end] = [];

  if (caveMap[start].findIndex((e) => e === end) === -1)
    caveMap[start].push(end);

  if (caveMap[end].findIndex((e) => e === start) === -1)
    caveMap[end].push(start);
});

var visitsWithEnd = [];
function visitAll(links, pathSoFar) {
  //console.log({ pathSoFar, links });

  for (var i = 0, j = links.length; i < j; i++) {
    var tunnel = links[i];
    var isUC = isUpper(tunnel);
    var isEnd = tunnel === "end";
    var isStart = tunnel === "start";

    var localPathSoFar = pathSoFar;
    //console.log({ tunnel, isUC, isEnd, isStart });

    if (isStart) continue; // Dead end
    if (!isUC && pathSoFar.indexOf(tunnel + "-") > -1) {
      // Allow a single case to be visisted twice
      if (localPathSoFar.indexOf("twice-") > -1) continue;

      localPathSoFar += "-twice-";
    } // Small cave already visited
    if (isEnd) {
      visitsWithEnd.push(localPathSoFar + "-end");
      continue;
    }

    // Upper case tunnel or unvisted lower case tunnel

    visitAll(caveMap[tunnel], localPathSoFar + "-" + tunnel);
  }
}

visitAll(caveMap["start"], "start-");

console.log({ caveMap, visitsWithEnd });

var endTime = performance.now();
console.log(`took ${endTime - startTime} ms`);
