var x = document.body.firstChild.textContent.split("\n");
x.splice(1000, 1);
var sz = x[0].length;
console.log({ x, sz });
var potentials = x;
for (var i = 0, j = sz; i < j; i++) {
  var z = potentials.reduce(
    (xi, xj) =>
      +((xi && xi.charAt && xi.charAt(i)) || xi || 0) +
      +((xj && xj.charAt && xj.charAt(i)) || xj || 0),
    0
  );

  var p = [];
  var halfSize = potentials.length / 2.0;
  var isOne = z >= halfSize ? "1" : "0";
  for (var n = 0, o = potentials.length; n < o; n++) {
    if (potentials[n].charAt(i) == isOne) p.push(potentials[n]);
  }
  console.log({ potentials, index: i, halfSize, sum: z, isOne, p });
  potentials = p;

  if (potentials.length === 1) break;
}
var lifeSupport = parseInt(potentials[0], 2);

var potentials = x;
for (var i = 0, j = sz; i < j; i++) {
  var z = potentials.reduce(
    (xi, xj) =>
      +((xi && xi.charAt && xi.charAt(i)) || xi || 0) +
      +((xj && xj.charAt && xj.charAt(i)) || xj || 0),
    0
  );

  var p = [];
  var halfSize = potentials.length / 2.0;
  var lessor = z < halfSize ? "1" : "0";
  for (var n = 0, o = potentials.length; n < o; n++) {
    if (potentials[n].charAt(i) == lessor) p.push(potentials[n]);
  }

  console.log({ potentials, index: i, p, halfSize, sum: z, lessor });
  potentials = p;

  if (potentials.length === 1) break;
}
var oxygen = parseInt(potentials[0], 2);
console.log({ lifeSupport, oxygen, sum: oxygen * lifeSupport });
