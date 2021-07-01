scoreboardHTML = document.getElementById("scoreboard");
bangHTML = document.getElementById("bang");
rules = document.getElementById("rules");
earlyPlayers = [];
latePlayers = [];
timeToWait = 0;
bangTime = 0;
startGameKey = " ";
winner = "";

rules.innerHTML = "Press " + "spacebar" + " to begin the showdown";

function clean() {
  earlyPlayers = [];
  scoreboardHTML.innerHTML = "";
  bangHTML.innerHTML = "";
  rules.innerHTML = "";
}

function showScoreboard() {
  let scoreboardText = earlyPlayers
    .map(
      (earlyPlayer) =>
        earlyPlayer.key.fontcolor("red") +
        " shoot " +
        (earlyPlayer.delta / 1000).toFixed(3) +
        " seconds before the BANG and lost!<br>"
    )
    .join("");

  winnerDelaySeconds = (nowTime() - bangTime) / 1000;
  scoreboardText +=
    "<br>" +
    winner.fontcolor("green") +
    " is the last one standing by shooting " +
    winnerDelaySeconds.toFixed(3) +
    " after BANG<br>Good reflexes kiddo<br>The waiting time was " +
    (timeToWait / 1000).toFixed(3) +
    " seconds<br>";

  scoreboardText += latePlayers
    .map(
      (latePlayer) =>
        `${latePlayer.key.fontcolor("red")} is late by ${(
          latePlayer.delta / 1000
        ).toFixed(3)}<br>`
    )
    .join("");
  scoreboardHTML.innerHTML = scoreboardText;
}

nowTime = () => new Date().getTime();

function catchEarlyPlayers(e) {
  if (earlyPlayers.map((earlyPlayer) => earlyPlayer.key).includes(e.key))
    return;
  let delta = bangTime - nowTime();
  earlyPlayers.push({ key: e.key, delta: delta });
}

function waitForWinner() {
  bangHTML.innerHTML = "BANG";
  document.removeEventListener("keydown", catchEarlyPlayers);

  waitForWinnerEvadingLosers();
}

function catchLatePlayers(e) {
  console.log("I catched " + e.key + " too late");
  // TODO: restrict also earlyPlayers
  let earlyPlayerKeys = earlyPlayers.map((earlyPlayer) => earlyPlayer.key)
  let latePlayerKeys = latePlayers.map((latePlayer) => latePlayer.key)

  if (earlyPlayerKeys.concat(latePlayerKeys).includes(e.key)) return;
  let delta = nowTime() - bangTime;
  latePlayers.push({ key: e.key, delta: delta });
  showScoreboard();
}

function waitForWinnerEvadingLosers() {
  document.addEventListener(
    "keydown",
    (e) => {
      if (earlyPlayers.map((earlyPlayer) => earlyPlayer.key).includes(e.key)) {
        console.log(e.key + ", no da bro ya perdiste");
        waitForWinnerEvadingLosers();
        return;
      }
      winner = e.key;
      showScoreboard();

      document.addEventListener("keydown", catchLatePlayers);
      setTimeout(() => {
        document.removeEventListener("keydown", catchLatePlayers);
        pressKeyToStartGame();
        rules.innerHTML = "Press " + "spacebar" + " to begin the showdown";
      }, 1000);
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
  document.addEventListener("keydown", catchEarlyPlayers);
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
