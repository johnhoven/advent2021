var startTime = performance.now();

var testInput = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C
`;

var x = document.body.firstChild.textContent.split("\n");
x = testInput.split("\n");
// Remove empty last line
x.splice(x.length - 1, 1);

var polymer = x[0];
x.splice(0, 2);

var templates = {};

x.forEach((line, lineNo) => {
  var [template, insert] = line.split(" -> ");
  templates[template] = insert;
});

var iters = 1;
var chars = polymer.split("");
do {
  var i = chars.length - 2;

  while (i >= 0) {
    var pair = chars[i] + chars[i + 1];
    if (templates.hasOwnProperty(pair)) {
      chars.splice(i + 1, 0, templates[pair]);
    } else {
      console.log("missing" + pair);
    }

    i--;
  }

  //console.log({ polymer: chars.join(""), iters });
  console.log("done with " + iters.toString());
  iters++;
} while (iters <= 10);

var count = {};

chars.forEach((c) => {
  var y = count[c] || 0;
  y++;
  count[c] = y;
});

var min = -1,
  max = -1;
for (var polymerChar in count) {
  var y = count[polymerChar];
  if (y < min || min == -1) min = y;
  if (y > max || max == -1) max = y;
}

console.log({ min, max, count, result: max - min });

var endTime = performance.now();
console.log(`took ${endTime - startTime} ms`);
