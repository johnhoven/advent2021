var testInput = `3,4,3,1,2
`;

const TotalDays = 80;
// Part 2, just change TotalDays to 256

var x = document.body.firstChild.textContent.split("\n");
//x = testInput.split("\n");

x.splice(x.length - 1, 1);
x = x[0].split(",");

var fish = [0, 0, 0, 0, 0, 0, 0, 0, 0];

for (var i = 0, j = x.length; i < j; i++) {
  fish[+x[i]] = fish[+x[i]] + 1;
}

for (var i = 0; i < TotalDays; i++) {
  var popping = fish.shift();
  fish[6] = fish[6] + popping;
  fish.push(popping);
}

var totalFish = 0;
fish.forEach((a) => {
  totalFish += a;
});

console.log({ totalFish });
