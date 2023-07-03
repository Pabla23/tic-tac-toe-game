// OPENING SCREEN VARIABLES
const xBtn = document.getElementById("btn-player-x");
const oBtn = document.getElementById("btn-player-o");
const openingScreen = document.getElementById("start-pop-up");

// OPENING SCREEN EVENT LISTENERS... CHOOSE X OR O
xBtn.addEventListener('click', function() {
    openingScreen.classList.add("fade-out");
    openingScreen.ontransitionend = () => {
        openingScreen.classList.add("hide");
        playerX = true;
        player1.innerHTML = playerName;
        player2.innerHTML = compName;
        statusText.innerHTML = playerTurnText();
    
        setTimeout(()=>{
        boxes.forEach(cell => cell.innerHTML = "");
        }, 300);
    };
});

oBtn.addEventListener('click', function() {
    openingScreen.classList.add("fade-out");
    openingScreen.ontransitionend = () => {
        openingScreen.classList.add("hide");
        playerO = true;
        player1.innerHTML = compName;
        player2.innerHTML = playerName;
        statusText.innerHTML = playerTurnText();
        setTimeout(()=>{boxes.forEach(cell => cell.innerHTML = "")}, 300);
    
        if(currentPlayer === "X" && playerO) {
            firstMove();
        }else
        return;
    };
});

// GAME VARIABLES
let playerOScore = 0;
let playerXScore = 0;
let tieScore = 0;
let gameArray = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isgameActive = true;
let playerX = false;
let playerO = false;
let boxes = document.querySelectorAll('.box');

const statusText = document.querySelector(".game-status");
const restartBtn = document.querySelector(".restart");
const changePlayerbtn = document.querySelector(".change-player");

let player1 = document.getElementById("player-name1");
let player2 = document.getElementById("player-name2");
let playerName = "Player ";
let compName = "Computer ";

const scoreO = document.getElementById('o-score');
const scoreX = document.getElementById('x-score');
const scoreT = document.getElementById('tie-score');

const playerWinText = () => `Player (${currentPlayer}) Wins!`;
const compWinText = () => `Computer (${currentPlayer}) Wins!`;
const playerTurnText = () => `It's ${currentPlayer}'s Turn`;
const drawText = () => "Round Over! It's a Draw!"

const winningConditions = [
    [0, 1, 2],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8]
];

const goodMoves = [0, 2, 4, 6, 8]

// GAMEBOARD
// [0] [1] [2]
// [3] [4] [5]
// [6] [7] [8]

// EVENT LISTENERS
changePlayerbtn.addEventListener('click', function(){
    if(confirm("Changing players will reset the score. Press 'OK' to continue.") == true) {
        location.reload();
    }else
    return;
});
boxes.forEach(box => box.addEventListener('click', boxClick));
restartBtn.addEventListener('click', restartGame);

// FUNCTIONS
function boxClick() {
    const clickedBox = (this);
    const clickedBoxIndex = parseInt(clickedBox.getAttribute('data-index'));

    // Validation to check whos turn it is.. and if the spot in the array is empty.
    if(currentPlayer === "X" && playerX === false){
        return;
    }
    if(currentPlayer === "O" && playerO === false){
        return;
    }
    if(gameArray[clickedBoxIndex] !== "" || isgameActive === false){
        return;
    }
    updateClickedBox(clickedBox, clickedBoxIndex);
    checkResults();
}

function updateClickedBox(clickedBox, clickedBoxIndex) {
    gameArray[clickedBoxIndex] = currentPlayer;
    clickedBox.innerHTML = currentPlayer;
}

// Check for a win/loss/draw after every move
function checkResults() {
    let win = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameArray[winCondition[0]];
        let b = gameArray[winCondition[1]];
        let c = gameArray[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            win = true;
            break; 
        }
    }
    if(win && currentPlayer === "X") {
        playerXScore = playerXScore + 1;
        updateScore();
        isgameActive = false;
        if(playerX) {
            statusText.innerHTML = playerWinText();
            return;
        }
        statusText.innerHTML = compWinText();
        return;
    }

    if(win && currentPlayer === "O") {
        playerOScore = playerOScore + 1;
        updateScore();
        isgameActive = false;
        if(playerO) {
            statusText.innerHTML = playerWinText();
            return;
        }
        statusText.innerHTML = compWinText();
        return;
    }

    let draw = !gameArray.includes("");
    if(draw) {
        tieScore = tieScore + 1;
        updateScore();
        statusText.innerHTML = drawText();
        isgameActive = false;
        return;
    }
    changePlayer();
}

function changePlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.innerHTML = playerTurnText();

    if(currentPlayer === "O" && playerX) {
        firstMove();
    }

    if(currentPlayer === "X" && playerO) {
        firstMove()
    }
}

// The computers first move(randomly selects the middle box or any of the 4 corner boxes)
function firstMove() {
    var newGameArray = gameArray.filter(function(element) {
        if(element === "") return [element];
    });
    // console.log(newGameArray)

    if(newGameArray.length >= 7) {
        let randomBox = goodMoves[Math.floor(Math.random() * goodMoves.length)];
        let chosenBox = boxes[randomBox];
        const boxIndex = parseInt(chosenBox.getAttribute('data-index'));
        
        if (gameArray[boxIndex] !== ""){
            firstMove();
            
        }else{
            updatehtml(chosenBox, boxIndex)
        }
    }else
    findWin();
    // console.log(gameArray)
}

// The computer's mid/end game moves. Regardless of whos turn it is, 2 in a row will be found and the "currentPlayer" variable will be put into the HTML.
// Results in a draw most of the time
function findWin() {
    possibleWin = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameArray[winCondition[0]];
        let b = gameArray[winCondition[1]];
        let c = gameArray[winCondition[2]];

        if (c === "X" && b === "X" && a === "") {
            possibleWin = true;
            chosenBox = boxes[winCondition[0]]
            const boxIndex = parseInt(chosenBox.getAttribute('data-index'));
            updatehtml(chosenBox, boxIndex)
            break;
        }

        if(a === "X" && c === "X" && b === ""){
            possibleWin = true;
            chosenBox = boxes[winCondition[1]];
            const boxIndex = parseInt(chosenBox.getAttribute('data-index'));
            updatehtml(chosenBox, boxIndex)
            break;
        }

        if(a === "X" && b === "X" && c === "") {
            possibleWin = true;
            chosenBox = boxes[winCondition[2]];
            const boxIndex = parseInt(chosenBox.getAttribute('data-index'));
            updatehtml(chosenBox, boxIndex)
            break;
        }

        if (c === "O" && b === "O" && a === "") {
            possibleWin = true;
            chosenBox = boxes[winCondition[0]]
            const boxIndex = parseInt(chosenBox.getAttribute('data-index'));
            updatehtml(chosenBox, boxIndex)
            break;
        }

        if(a === "O" && c === "O" && b === ""){
            possibleWin = true;
            chosenBox = boxes[winCondition[1]];
            const boxIndex = parseInt(chosenBox.getAttribute('data-index'));
            updatehtml(chosenBox, boxIndex)
            break;
        }

        if(a === "O" && b === "O" && c === "") {
            possibleWin = true;
            chosenBox = boxes[winCondition[2]];
            const boxIndex = parseInt(chosenBox.getAttribute('data-index'));
            updatehtml(chosenBox, boxIndex)
            break;
        }
    }
    if(possibleWin === false) {
        random();
    }
}

// If there is no possible win on the board, X or O will randomly be placed on the board.
function random() {
    let randomBox = [Math.floor(Math.random() * boxes.length)];
    let chosenBox = boxes[randomBox];
    const boxIndex = parseInt(chosenBox.getAttribute('data-index'));

    if (gameArray[boxIndex] !== ""){
        random();
        
    }else{
        updatehtml(chosenBox, boxIndex)
    }
}

// Update the game array and HTML
function updatehtml(chosenBox, boxIndex) {
    setTimeout(()=>{
        chosenBox.innerHTML = currentPlayer;
        gameArray[boxIndex] = currentPlayer;
        checkResults();
    }, 600);
}

function updateScore() {
    document.getElementById('o-score').innerHTML = playerOScore;
    document.getElementById('x-score').innerHTML = playerXScore;
    document.getElementById('tie-score').innerHTML = tieScore;
}

function restartGame() {
    if(isgameActive === false){
        gameArray = ["", "", "", "", "", "", "", "", ""];
        currentPlayer = "X"
        isgameActive = true;
        statusText.innerHTML = playerTurnText();
        boxes.forEach(cell => cell.innerHTML = "");
        console.clear()
        if(currentPlayer === "X" && playerO) {
            firstMove();
        }else
        return;
    }
}
