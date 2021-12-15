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

// Counts represents the Count of each type of polymer pairs at each iteration
var counts = {};

x.forEach((line, lineNo) => {
  var [template, insert] = line.split(" -> ");
  templates[template] = insert;
  counts[template] = 0;
});

// Set the initial pair counts
var chars = polymer.split("");
var i = chars.length - 2;
while (i >= 0) {
  var pair = chars[i] + chars[i + 1];
  counts[pair] = counts[pair] + 1;
  i--;
}

//console.log(counts);

var iters = 1;
do {
  // Record updated counts in new newCounts object, so original counts remains the same through all polymer pairs in this iteration
  var newCounts = {};
  for (var template in counts) {
    var c = counts[template] || 0;

    if (c > 0) {
      var [c1, c2] = template.split("");
      var cx = templates[c1 + c2];

      // We don't have to set newCounts[c1 + c2] since it's a new object and its not there by default
      // Each count in the original splits into two different pairs
      newCounts[c1 + cx] = (newCounts[c1 + cx] || 0) + c;
      newCounts[cx + c2] = (newCounts[cx + c2] || 0) + c;
    }
  }

  // Finally, apply back to our counts variable
  counts = newCounts;

  console.log("done with " + iters.toString());
  iters++;
} while (iters <= 40);

// Only count the first character of each template.  Except for the last template, the second character will always appear in another template pair
var individualCounts = {};
for (var template in counts) {
  var [c1, c2] = template.split("");
  var c = counts[template] || 0;

  individualCounts[c1] = (individualCounts[c1] || 0) + c;
  //individualCounts[c2] = (individualCounts[c2] || 0) + c;
}

// Handle that exception, the last character.  It never changes from the original polymer
var finalChar = chars[chars.length - 1];
individualCounts[finalChar] = (individualCounts[finalChar] || 0) + 1;

// Find min and max
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
