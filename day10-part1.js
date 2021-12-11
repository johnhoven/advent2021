var testInput = `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]
`;

var x = document.body.firstChild.textContent.split("\n");
x = testInput.split("\n");

x.splice(x.length - 1, 1);

function isMatch(queue, matchFor) {
  return queue[queue.length - 1] === matchFor;
}

function getCost(checkChar) {
  switch (checkChar) {
    case "(":
      return 3;
    case "[":
      return 57;
    case "{":
      return 1197;
    case "<":
      return 25137;
  }
  return -99999999;
}

var corruptCost = 0;
x.forEach((line, lineNo) => {
  var queue = [];
  var checkChar;
  var corrupt = false;
  for (var i = 0, j = line.length; i < j; i++) {
    var char = line.charAt(i);

    var checkChar = null;
    if (char === ")") checkChar = "(";
    if (char === "]") checkChar = "[";
    if (char === "}") checkChar = "{";
    if (char === ">") checkChar = "<";

    if (checkChar && !isMatch(queue, checkChar)) {
      lineNo === 0 && console.log(char);

      corrupt = true;
      break;
    } else if (checkChar) {
      queue.pop();
    } else {
      queue.push(char);
    }
    //lineNo === 0 && console.log(char);
    //lineNo === 0 && console.log(queue);
  }

  if (corrupt) {
    corruptCost += getCost(checkChar);
    //console.log({ corrupt, queue, line });
  }
});

console.log({ corruptCost });
