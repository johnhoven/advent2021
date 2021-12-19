var startTime = performance.now();

function simulate(x, y, xmin, xmax, ymin, ymax) {
  var pX = 0,
    py = 0;
  var velX = x,
    velY = y;

  var result = false;
  var maxHeight = -1;

  do {
    pX += velX;
    py += velY;
    velX = velX + (velX > 0 ? -1 : velX < 0 ? 1 : 0);
    velY--;

    if (py > maxHeight) maxHeight = py;

    result = pX >= xmin && pX <= xmax && py >= ymin && py <= ymax;
  } while (
    // If we're out of velocity and haven't reached the X target range,
    // our initial velocity was too low
    (velX > 0 || pX >= xmin) &&
    // If we've overshot our target range, we can't make it back
    pX <= xmax &&
    // If we've passed through the bottom of the target zone
    py >= ymin &&
    !result
  );

  return [result, maxHeight];
}

function processTest(x) {
  var area = x[0];
  area = area.split(":")[1];
  var [xarea, yarea] = area.split(",");
  var [xmin, xmax] = xarea.trim().substr(2).split("..");
  var [ymin, ymax] = yarea.trim().substr(2).split("..");
  xmin = +xmin;
  xmax = +xmax;
  ymin = +ymin;
  ymax = +ymax;

  console.log({
    xmin,
    xmax,
    ymin,
    ymax,
    input: x[0],
  });

  // 236...262 // -78..-58

  //

  var maxTotal = -1;
  var successes = 0;

  for (var i = 1, j = xmax; i <= j; i++) {
    for (var k = ymin, l = ymin * -1; k <= l; k++) {
      var [landed, maxHeight] = simulate(i, k, xmin, xmax, ymin, ymax);

      if (landed) {
        console.log(
          `An initial velocity of (${i},${k}) - results ${landed} with max height: ${maxHeight}`
        );
        successes++;
        if (maxTotal == -1 || maxHeight > maxTotal) {
          maxTotal = maxHeight;
        }
      }
    }
  }

  console.log(`Maximum: ${maxTotal}, Total: ${successes}`);
}

var testData = `target area: x=20..30, y=-10..-5`;
processTest([testData]);

var x = document.body.firstChild.textContent.split("\n");
// Remove empty last line
x.splice(x.length - 1, 1);
processTest(x);

var endTime = performance.now();
console.log(`took ${endTime - startTime} ms`);
