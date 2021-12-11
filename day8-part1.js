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

var count = 0;

for (var i = 0, j = x.length; i < j; i++) {
  var split = x[i].split("|");
  var output = split[1].trim();

  var outputSplit = output.split(" ");
  for (var k = 0, l = outputSplit.length; k < l; k++) {
    var outputNum = outputSplit[k],
      outputNumLen = outputNum.length;

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

    if (
      outputNumLen == 2 ||
      outputNumLen == 3 ||
      outputNumLen == 4 ||
      outputNumLen == 7
    )
      count++;
  }
}

console.log({ count });
