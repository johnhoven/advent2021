var testInput = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce
`;

var x = document.body.firstChild.textContent.split("\n");
x = testInput.split("\n");

x.splice(x.length - 1, 1);

function sortKey(key) {
  return key.split("").sort().join("");
}
function decoderSpecial(inputs) {
  var one,
    seven,
    four,
    fives = [],
    sixes = [],
    wires = {},
    signalPatterns = {};

  for (var i = 0, j = inputs.length; i < j; i++) {
    var input = inputs[i],
      l = input.length;
    if (l === 2) {
      one = input;
      signalPatterns[sortKey(input)] = 1;
    } else if (l === 3) {
      seven = input;
      signalPatterns[sortKey(input)] = 7;
    } else if (l === 4) {
      four = input;
      signalPatterns[sortKey(input)] = 4;
    } else if (l === 7) {
      signalPatterns[sortKey(input)] = 8;
    } else if (l === 5) fives.push(input);
    else if (l === 6) sixes.push(input);
  }

  var temp = seven;
  var rightOne = one.charAt(0);
  var rightTwo = one.charAt(1);
  temp = temp.replace(rightOne, "");
  temp = temp.replace(rightTwo, "");
  wires["TOP"] = temp;

  temp = four;
  temp = temp.replace(rightOne, "");
  temp = temp.replace(rightTwo, "");
  var fourUniqueOne = temp.charAt(0);
  var fourUniqueTwo = temp.charAt(1);

  var nine;
  for (var i = 0, j = sixes.length; i < j; i++) {
    var test = sixes[i];
    if (test.indexOf(fourUniqueOne) == -1) {
      wires["MID"] = fourUniqueOne;
      wires["TL"] = fourUniqueTwo;
      signalPatterns[sortKey(test)] = 0;
    } else if (test.indexOf(fourUniqueTwo) == -1) {
      wires["MID"] = fourUniqueTwo;
      wires["TL"] = fourUniqueOne;
      signalPatterns[sortKey(test)] = 0;
    } else if (test.indexOf(rightOne) == -1) {
      wires["TR"] = rightOne;
      wires["BR"] = rightTwo;
      signalPatterns[sortKey(test)] = 6;
    } else if (test.indexOf(rightTwo) == -1) {
      wires["BR"] = rightOne;
      wires["TR"] = rightTwo;
      signalPatterns[sortKey(test)] = 6;
    } else {
      nine = test;
      signalPatterns[sortKey(test)] = 9;
    }
  }

  nine = nine.replace(wires["TOP"], "");
  nine = nine.replace(wires["TL"], "");
  nine = nine.replace(wires["TR"], "");
  nine = nine.replace(wires["MID"], "");
  nine = nine.replace(wires["BR"], "");
  wires["BOT"] = nine;

  temp = "abcdefg";
  temp = temp.replace(wires["TOP"], "");
  temp = temp.replace(wires["TL"], "");
  temp = temp.replace(wires["TR"], "");
  temp = temp.replace(wires["MID"], "");
  temp = temp.replace(wires["BR"], "");
  temp = temp.replace(wires["BOT"], "");
  wires["BL"] = temp;

  // Need to determine signal patterns of 5, 2, 3
  for (var i = 0, j = fives.length; i < j; i++) {
    temp = fives[i];
    if (temp.indexOf(wires["TL"]) > -1) {
      signalPatterns[sortKey(temp)] = 5;
    } else if (temp.indexOf(wires["BR"]) === -1) {
      signalPatterns[sortKey(temp)] = 2;
    } else {
      signalPatterns[sortKey(temp)] = 3;
    }
  }

  //console.log({ wires, signalPatterns });

  return signalPatterns;
}

var totalSum = 0;

for (var i = 0, j = x.length; i < j; i++) {
  var split = x[i].split("|");
  var inputs = split[0].trim().split(" ");
  var output = split[1].trim();

  var patterns = decoderSpecial(inputs);

  var outputSplit = output.split(" ");
  var iterSum = 0;
  for (var k = 0, l = outputSplit.length; k < l; k++) {
    var outputNum = outputSplit[k];
    var translated = patterns[sortKey(outputNum)] * Math.pow(10, l - k - 1);
    iterSum += translated;
    totalSum += translated;

    // Length 2 == 1.  Signal wires are on full right
    // Length 3 == 7.  Signal wires are top and full right.  Difference is top wire
    // Length 4 == 4.  Signal wires are TL, MID, and full right.  We have two digits which can be TL/Mid and the same two digits as 1

    // Length 6 could be 0, 6, 9
    // Length 5 could be 2, 3, 5,

    // Zero:  If Length 6 does not contain both the TL/Mid signals from length 4 (mid)
    // At this point, we've reasoned dddd (Mid), the only wire not hot
    // Six:  If Length 6 does not contain both hte right signals from length 1
    // At this point, we've reasoned cc (TR), the only wire not hot
    // At this point, we've reasoned ff (BR) from TR, looking at 1
    // At this point, we've reasoned aa (top) from #1, looking at 7

    // Nine:  If still Length 6
    // At this point, we've reasoned ee (BL), the only wire not hot

    // With Zero and Six, we can reason bb (TL) by removing mid and right

    // GGGG is all that's left, process of elmination

    // AAAA TOP SOLVED
    // BBBB TL SOLVED
    // CCCC TR SOLVED
    // DDDD MID SOLVED
    // EEEE BL SOLVED
    // FFFF BR SOLVED
    // GGGG BOT
  }
  console.log({ iterSum, patterns });
}

console.log({ totalSum });
