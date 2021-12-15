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
var counts = {};

x.forEach((line, lineNo) => {
  var [template, insert] = line.split(" -> ");
  templates[template] = insert;
  counts[template] = 0;
});

var chars = polymer.split("");
var i = chars.length - 2;
while (i >= 0) {
  var pair = chars[i] + chars[i + 1];
  counts[pair] = counts[pair] + 1;
  i--;
}

console.log(counts);

var iters = 1;
do {
  var newCounts = {};
  for (var template in counts) {
    var c = counts[template] || 0;

    if (c > 0) {
      var [c1, c2] = template.split("");
      var cx = templates[c1 + c2];

      //newCounts[template] = 0;
      newCounts[c1 + cx] = (newCounts[c1 + cx] || 0) + c;
      newCounts[cx + c2] = (newCounts[cx + c2] || 0) + c;
    }
  }

  counts = newCounts;

  console.log("done with " + iters.toString());
  iters++;
} while (iters <= 40);

var individualCounts = {};
for (var template in counts) {
  var [c1, c2] = template.split("");
  var c = counts[template] || 0;

  individualCounts[c1] = (individualCounts[c1] || 0) + c;
  //individualCounts[c2] = (individualCounts[c2] || 0) + c;
}

var finalChar = chars[chars.length - 1];
individualCounts[finalChar] = (individualCounts[finalChar] || 0) + 1;

var min = -1,
  max = -1;
for (var polymerChar in individualCounts) {
  var y = individualCounts[polymerChar];
  if (y < min || min == -1) min = y;
  if (y > max || max == -1) max = y;
}

console.log({ min, max, individualCounts, result: max - min });

var endTime = performance.now();
console.log(`took ${endTime - startTime} ms`);
