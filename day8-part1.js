var testInput = `16,1,2,0,4,2,7,1,2,14
`;

var x = document.body.firstChild.textContent.split("\n");
x = testInput.split("\n");

x.splice(x.length - 1, 1);
x = x[0].split(",");

var crabs = {};
var min = null,
  max = null;
for (var i = 0, j = x.length; i < j; i++) {
  var num = +x[i];
  crabs[num] = (crabs[num] || 0) + 1;

  if (num < min || min == null) min = num;
  if (num > max || max == null) max = num;
}

var costs = {};

for (var i = min, j = max; i <= j; i++) {
  var cost = 0;

  for (var k = min, l = max; k <= l; k++) {
    if (i == k) continue;

    var distance = Math.abs(k - i);

    var fuelCost = (distance * (1 + distance)) / 2;

    cost += (crabs[k] || 0) * fuelCost;
  }

  costs[i] = cost;
}

var min = null;
for (var i in costs) {
  if (costs[i] < min || min == null) min = costs[i];
}

console.log({ min, costs });
