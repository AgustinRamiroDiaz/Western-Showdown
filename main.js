scoreboardHTML = document.getElementById("scoreboard");
bangHTML = document.getElementById("bang");
rules = document.getElementById("rules");
losers = [];
timeToWait = 0
bangTime = 0;
startGameKey = " ";

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
        loser.key.fontcolor("red") +
        " shoot " +
        (loser.delta / 1000).toFixed(3) +
        " seconds before the BANG and lost!<br>"
    )
    .join("");

  winnerDelaySeconds = (nowTime() - bangTime) / 1000;
  scoreboardText +=
    "<br>" +
    winner.fontcolor("green") +
    " is the last one standing by shooting " +
    winnerDelaySeconds.toFixed(3) +
    " after BANG<br>Good reflexes kiddo<br>The waiting time was " + (timeToWait/1000).toFixed(3) + " seconds";
  scoreboardHTML.innerHTML = scoreboardText;
}

nowTime = () => new Date().getTime();

function handleLosers(e) {
  if (losers.map((loser) => loser.key).includes(e.key)) return
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
        console.log(e.key + ", no da bro ya perdiste");
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
