scoreboardHTML = document.getElementById("scoreboard");
bangHTML = document.getElementById("bang");
losers = [];

function clean() {
  losers = [];
  scoreboardHTML.innerHTML = "";
  bangHTML.innerHTML = "";
}

function showScoreboard(winner) {
  let scoreboardText = losers
    .map((loser) => loser + " shoot before the BANG<br>")
    .join("");
  scoreboardText += winner + " wins<br>";
  scoreboardHTML.innerHTML = scoreboardText;
}

function handleLosers(e) {
  losers.push(e.key);
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
      if (losers.includes(e.key)) {
        console.log(e.key + ', no da bro ya perdiste')
        waitForWinnerEvadingLosers();
        return;
      }
      showScoreboard(e.key);
      pressSpaceToStartGame();
    },
    { once: true }
  );
}

function showdown(startsIn, timeRange) {
  // Convert to miliseconds
  startsIn *= 1000;
  timeRange *= 1000;

  timeToWait = startsIn + Math.random() * timeRange;
  document.addEventListener("keydown", handleLosers);
  setTimeout(waitForWinner, timeToWait);
}

function pressSpaceToStartGame() {
  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key == " ") {
        clean();
        showdown(3, 4);
      }
    },
    { once: true }
  );
}

pressSpaceToStartGame();
