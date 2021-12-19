var startTime = performance.now();

var testInput = `620080001611562C8802118E34
`;

var x = document.body.firstChild.textContent.split("\n");
x = testInput.split("\n");
// Remove empty last line
x.splice(x.length - 1, 1);

var expansion = "";
x[0].split("").forEach((c) => {
  expansion += parseInt(c, 16).toString(2).padStart(4, "0");
});

var versions = 0;
var stack = [];

while (expansion.length >= 6) {
  console.log({ expansion });
  var version = parseInt(expansion.substr(0, 3), 2);

  //if (version == 0) {
  //  break;
  //}

  versions = versions + version;
  var packetTypeId = parseInt(expansion.substr(3, 3), 2);

  expansion = expansion.substr(6);

  if (packetTypeId == 4) {
    console.log("found literal packet");
    var keepGoing;
    do {
      keepGoing = expansion.substr(0, 1);
      stack.push(parseInt(expansion.substr(1, 4), 2));
      expansion = expansion.substr(5);
    } while (keepGoing == "1");
  } else {
    console.log("found operator packet");
    var length = expansion.substr(0, 1) == "1" ? 11 : 15;
    var value = parseInt(expansion.substr(1, length), 2);
    expansion = expansion.substr(length + 1);

    if (length === 15) {
      //var keepGoing;
      //do {
      //  keepGoing = expansion.substr(0, 1);
      //  stack.push(parseInt(expansion.substr(1, 4), 2));
      //  expansion = expansion.substr(5);
      //} while (keepGoing == "1");
      //expansion = expansion.substr(value);
    } else {
      // value represents number of sub-packets
      // Just continue processing
    }
  }
}

console.log({ versions });

var endTime = performance.now();
console.log(`took ${endTime - startTime} ms`);
