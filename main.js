// function generate_table() {
//   // get the reference for the body
//   var body = document.getElementsByTagName("body")[0];

//   // creates a <table> element and a <tbody> element
//   var tbl = document.getElementById("scoreboard table");
//   var tblBody = document.createElement("tbody");

//   // creating all cells
//   for (var i = 0; i < 2; i++) {
//     // creates a table row
//     var row = document.createElement("tr");

//     for (var j = 0; j < 2; j++) {
//       // Create a <td> element and a text node, make the text
//       // node the contents of the <td>, and put the <td> at
//       // the end of the table row
//       var cell = document.createElement("td");
//       var cellText = document.createTextNode(
//         "cell in row " + i + ", column " + j
//       );
//       cell.appendChild(cellText);
//       row.appendChild(cell);
//     }

//     // add the row to the end of the table body
//     tblBody.appendChild(row);
//   }

//   // put the <tbody> in the <table>
//   tbl.appendChild(tblBody);
//   // appends <table> into <body>
//   body.appendChild(tbl);
//   // sets the border attribute of tbl to 2;
//   tbl.setAttribute("border", "2");
// }

// generate_table();
const ShowDown = {
  data() {
    return {
      message: "xd",
    };
  },
};
Vue.createApp(ShowDown).mount("#ShowDown");

scoreboardHTML = document.getElementById("scoreboard");
bangHTML = document.getElementById("bang");
rules = document.getElementById("rules");
losers = [];
timeToWait = 0;
bangTime = 0;
startGameKey = " ";
bangText = "BANG";

rules.innerHTML = "Press " + "spacebar" + " to begin the showdown";

function clean() {
  losers = [];
  scoreboardHTML.innerHTML = "";
  bangHTML.innerHTML = "";
}

function showScoreboard(winner) {
  let scoreboardText = losers
    .map(
      (loser) =>
        `${loser.key.fontcolor("red")} shoot ${(loser.delta / 1000).toFixed(
          3
        )} seconds before the ${bangText} and lost!<br>`
    )
    .join("");

  winnerDelaySeconds = (nowTime() - bangTime) / 1000;
  scoreboardText += `<br> ${winner.fontcolor(
    "green"
  )} is the last one standing by shooting ${winnerDelaySeconds.toFixed(
    3
  )} after ${bangText}<br>Good reflexes kiddo<br>The waiting time was ${(
    timeToWait / 1000
  ).toFixed(3)} seconds`;
  scoreboardHTML.innerHTML = scoreboardText;
}

nowTime = () => new Date().getTime();

function handleLosers(e) {
  if (losers.map((loser) => loser.key).includes(e.key)) return;
  let delta = bangTime - nowTime();
  losers.push({ key: e.key, delta: delta });
}

function waitForWinner() {
  bangHTML.innerHTML = "BANG";
  document.removeEventListener("keydown", handleLosers);

  waitForWinnerEvadingLosers();
}

function waitForWinnerEvadingLosers() {
  document.addEventListener(
    "keydown",
    (e) => {
      if (losers.map((loser) => loser.key).includes(e.key)) {
        waitForWinnerEvadingLosers();
        return;
      }
      showScoreboard(e.key);
      pressKeyToStartGame();
    },
    { once: true }
  );
}

function randomBetween(lowBound, highBound) {
  return Math.random() * (highBound - lowBound) + lowBound;
}

function showdown(fromTime, toTime) {
  // Convert to miliseconds
  timeToWait = randomBetween(fromTime, toTime) * 1000;

  bangTime = nowTime() + timeToWait;
  document.addEventListener("keydown", handleLosers);
  setTimeout(waitForWinner, timeToWait);
}

function pressKeyToStartGame() {
  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key != startGameKey) {
        pressKeyToStartGame();
        return;
      }
      clean();
      showdown(3, 4);
    },
    { once: true }
  );
}

pressKeyToStartGame();
