scoreboardHTML = document.getElementById("scoreboard");
bangHTML = document.getElementById("bang");
rules = document.getElementById("rules");
losers = [];
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
        loser.key +
        " shoot " +
        (loser.delta / 1000).toFixed(3) +
        " seconds before the BANG<br>"
    )
    .join("");

  winnerDelaySeconds = (nowTime() - bangTime) / 1000;
  scoreboardText +=
    "<br>" +
    winner +
    " wins by shooting " +
    winnerDelaySeconds.toFixed(3) +
    " after BANG<br>Good reflexes kiddo";
  scoreboardHTML.innerHTML = scoreboardText;
}

nowTime = () => new Date().getTime();

function handleLosers(e) {
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

function showdown(startsIn, timeRange) {
  // Convert to miliseconds
  startsIn *= 1000;
  timeRange *= 1000;
  timeToWait = startsIn + Math.random() * timeRange;

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
