var audioPlayer = document.getElementById("audioPlayer");
var isPlaying = true;
var audioButton = document.getElementById("audioPlayerButton")

audioPlayer.play();
updateEmoji()

function changeBackgroundMusicStatus() {
  if (isPlaying) {
    audioPlayer.pause();
  } else {
    audioPlayer.play();
  }
  isPlaying = !isPlaying;
  updateEmoji()
}

function updateEmoji() {
  if (isPlaying) {
    audioButton.innerHTML = '🕪'
  } else {
    audioButton.innerHTML = '🕨'
  }
}
