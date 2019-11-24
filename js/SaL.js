var pos = [0, 0];
var lastTurn = 0;
var nextTurn = 1;
var rollResult = [-1, -1];
var climbPos = 0;
var fallPos = 0;
var infoTxt = document.querySelector('textarea[id = "messageBox"]');
var lblLastRollPl1 = document.querySelector('span[id = "lastRollPl1"]');
var lblLastRollPl2 = document.querySelector('span[id = "lastRollPl2"]');
var lblCurPosPl1 = document.querySelector('span[id = "curPosPl1"]');
var lblCurPosPl2 = document.querySelector('span[id = "curPosPl2"]');
var btn = document.getElementsByClassName("rollBtn");
var startBtn = document.querySelector('button[id="startBtn"]');
var firstRun = true;

function roll(player) {
    rollResult[player - 1] = Math.round((Math.random() * 6));
    lastTurn = player;
    lastRoll();
}

function lastRoll() {
    lblLastRollPl1.textContent = "" + rollResult[0];
    lblLastRollPl2.textContent = "" + rollResult[1];
}

function updatePos(player) {
    if (pos[player - 1] + rollResult[player - 1] <= 25 && (climbPos + fallPos) == 0)
        pos[player - 1] += rollResult[player - 1];
    lblCurPosPl1.textContent = pos[0];
    lblCurPosPl2.textContent = pos[1];
}

function checkSnL(player) {
    climbPos = 0;
    fallPos = 0;
    if (pos[player - 1] == 8)
        climbPos = 15;
    else if (pos[player - 1] == 19)
        climbPos = 24;
    else if (pos[player - 1] == 15)
        fallPos = 5;
    else if (pos[player - 1] == 23)
        fallPos = 16;
    if (climbPos != 0) {
        pos[player - 1] = climbPos;
        infoTxt.value += "\n" + "Player " + player + " landed on a ladder and climbed to position " + climbPos;
    }
    if (fallPos != 0) {
        pos[player - 1] = fallPos;
        infoTxt.value += "\n" + "Player " + player + " landed on a snake and fell to position " + fallPos;
    }
    updatePos(player);

}

function win() {
    var highScorer = pos[0] > pos[1] ? 1 : 2;
    if (pos[highScorer - 1] == 25) {
        infoTxt.value += "\n" + "Player " + highScorer + " has won the game!";
        infoTxt.scrollTop = infoTxt.scrollHeight;
        return true;
    }
    else {
        infoTxt.value += "\n" + "Player " + highScorer + " is about to win!";
        return false;
    }
}

function play(player) {
    roll(player);
    if (!firstRun) {
        checkSnL(player);
        updatePos(player);
    }
    nextTurn = lastTurn == 1 ? 2 : 1;
    btn[lastTurn - 1].disabled = true;
    btn[nextTurn - 1].disabled = false;
    moderator();
    infoTxt.scrollTop = infoTxt.scrollHeight;
}

function reset() {
    pos[0] = 0;
    pos[1] = 0;
    rollResult[0] = -1;
    rollResult[1] = -1;
    firstRun = true;
    nextTurn = 1;
}

function moderator() {
    infoTxt.scrollTop = infoTxt.scrollHeight;
    startBtn.disabled = true;
    if (firstRun)
        btn[0].disabled = false;
    if (nextTurn == 1) {
        infoTxt.value += "\n" + "Player 1, roll the die!"
    }
    if (nextTurn == 2) {
        infoTxt.value += "\n" + "Player 2, roll the die!";
    }
    if (firstRun && rollResult[1] != -1)
        if (rollResult[0] == rollResult[1] && rollResult[0]) {
            infoTxt.value += "\n" + "That was a tie! Let's try again."
            stage = 1;
        }
        else {
            if (rollResult[0] > rollResult[1]) {
                firstRun = false;
                infoTxt.value += "\n" + "Player 1 will begin. Roll the die Player 1!";
                btn[0].disabled = false;
                btn[1].disabled = true;
                lastTurn = 2;
            }
            else if (rollResult[0] < rollResult[1]) {
                firstRun = false;
                infoTxt.value += "\n" + "Player 2 will begin. Roll the die Player 2!";
                btn[1].disabled = false;
                btn[0].disabled = true;
                lastTurn = 1;
            }
        }
    else {
        if (pos[0] >= 25 || pos[1] >= 25)
            if (win()) {
                btn[0].disabled = true;
                btn[1].disabled = true;
                startBtn.disabled = false;
                reset();
            }
    }

}
