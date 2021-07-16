// Auxiliary functions
nowTime = () => new Date().getTime();

function randomBetween(lowBound, highBound) {
  return Math.random() * (highBound - lowBound) + lowBound;
}

// Global variables
var bangAudioPlayer = document.getElementById("bangAudioPlayer");
var gunImage = document.getElementById("gun image")

var scoreboardHTML = document.getElementById("scoreboard");
var rules = document.getElementById("rules");
var earlyPlayers = [];
var latePlayers = [];
var timeToWait = 0;
var bangTime = 0;
var startGameKey = " ";
var winner = {};

rules.innerHTML = "Press " + "spacebar" + " to begin the showdown";

// Functions

function clean() {
  document.title = "A Western Showdown"
  earlyPlayers = [];
  latePlayers = [];
  scoreboardHTML.innerHTML = "";
  rules.innerHTML = "";
  gunImage.src = "images/westernBlackNoBang.png"
}

function showScoreboard() {
  let scoreboardText = earlyPlayers
    .map(
      (earlyPlayer) =>
        earlyPlayer.key.fontcolor("red") +
        ` is in a hurry (-${(earlyPlayer.delta / 1000).toFixed(3)})<br>`
    )
    .join("");

  scoreboardText +=
    "<br>" +
    winner.key.fontcolor("green") +
    " is the last one standing (+" +
    (winner.delta / 1000).toFixed(3) +
    ")<br><br>";

  scoreboardText += latePlayers
    .map((latePlayer) => `${latePlayer.key.fontcolor("red")} is too late (+${(latePlayer.delta / 1000).toFixed(3)})<br>`)
    .join("");
  scoreboardHTML.innerHTML = scoreboardText;

  scoreboardHTML.scrollIntoView();
}

function showdown(fromTime, toTime) {
  // Convert to miliseconds
  timeToWait = randomBetween(fromTime, toTime) * 1000;

  bangTime = nowTime() + timeToWait;
  document.addEventListener("keydown", catchEarlyPlayers);
  setTimeout(() => {document.removeEventListener("keydown", catchEarlyPlayers)}, timeToWait);

  setTimeout(waitForWinner, timeToWait);
}

function waitForWinner() {
  BANG()
  
  waitForWinnerEvadingLosers();
}

function BANG() {
  document.title = "BANG!"
  bangAudioPlayer.play()
  gunImage.src = "images/westernBlackBang.png"
}

// It also updates the scoreboard
function catchLatePlayers(e) {
  console.log("I catched " + e.key + " too late");
  let earlyPlayerKeys = earlyPlayers.map((earlyPlayer) => earlyPlayer.key);
  let latePlayerKeys = latePlayers.map((latePlayer) => latePlayer.key);
  let winnerKey = winner.key

  let allPlayers = earlyPlayerKeys.concat(latePlayerKeys, winnerKey)

  if (allPlayers.includes(e.key)) return;
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
      winner.key = e.key;
      winner.delta = nowTime() - bangTime
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

function catchEarlyPlayers(e) {
  if (earlyPlayers.map((earlyPlayer) => earlyPlayer.key).includes(e.key)) return;
  let delta = bangTime - nowTime();
  earlyPlayers.push({ key: e.key, delta: delta });
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
      showdown(3, 7);
    },
    { once: true }
  );
}

pressKeyToStartGame();


console.log("gugu+gali=<3")