winnerHTML = document.getElementById("winner")
bangHTML = document.getElementById("bang")

function clean() {
    winnerHTML.innerHTML = ''
    bangHTML.innerHTML = ''
}

function showWinner(winner) {
    winnerHTML.innerHTML = winner + ' wins'
}

function waitForWinner() {
    document.addEventListener("keydown", e => {
        showWinner(e.key)
        }, {once: true});
}

function showdown(startsIn, timeRange) {
    // Convert to miliseconds
    startsIn *= 1000
    timeRange *= 1000

    timeToWait = startsIn + Math.random() * timeRange
    setTimeout(() => {
        bangHTML.innerHTML = "BANG"
        waitForWinner()
    }, timeToWait);
}

document.addEventListener("keydown", e => {
    if (e.key == " ") {
        clean()
        showdown(3, 4)
    }
    });