const statusMsg = document.querySelector('.status');
const cells = document.querySelectorAll('.cell');
const restartBtns = document.querySelectorAll('.restart');
const modal = document.querySelector('.modal');
const modalWinMsg = document.querySelector('.winning-msg');
const closeBtn = document.querySelector('.close');
const scoreBtns = document.querySelectorAll('.high-score');
const modalScore = document.querySelector('.modal-score');
const scoreDiv = document.querySelector('.score');
const closeScoreBtn = document.querySelector('.close-score');
let currentPlayer = "X";
let activeGame = true;
let state = ["", "", "", "", "", "", "", "", ""];
let count = 0;
const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
const cellWidth = cells[0].clientWidth;
const circle = `<svg class="circle">
                <circle r="${cellWidth / 2 - cellWidth * 0.17}" cx="${cellWidth / 2}" cy="${cellWidth / 2}" 
                stroke="white" stroke-width="10" fill="none" stroke-linecap="round" />
              </svg>`;
const cross = `<svg class="cross">
                <line class="first" x1="${cellWidth - cellWidth * 0.8}" y1="${cellWidth - cellWidth * 0.8}"
                x2="${cellWidth - cellWidth * 0.2}" y2="${cellWidth - cellWidth * 0.2}"
                stroke="white" stroke-width="10" stroke-linecap="round" />
                <line class="second" x1="${cellWidth - cellWidth * 0.2}" y1="${cellWidth - cellWidth * 0.8}"
                x2="${cellWidth - cellWidth * 0.8}" y2="${cellWidth - cellWidth * 0.2}"
                stroke="white" stroke-width="10" stroke-linecap="round" />
              </svg>`;
let lastTenGamesScore = [];
let sortedTableScore = [];
let lastGame;
let points = 0;
const winMsg = () => `Player ${currentPlayer} has won in ${count} steps!`;
const drawMsg = () => `Game ended in a draw!`;
const turnMsg = () => `It's ${currentPlayer}'s turn`;

statusMsg.innerHTML = turnMsg();

function controlCellPlayed(checkedCell, checkedCellIndex) {
  state[checkedCellIndex] = currentPlayer;
  if (currentPlayer === "X") {
    checkedCell.innerHTML = cross;

  } else if (currentPlayer === "O") {
    checkedCell.innerHTML = circle;
    
  }
  count++;
}

function controlPlayerChange() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusMsg.innerHTML = turnMsg();
}

function controlCountScore() {
  if (lastTenGamesScore.length === 10) {
    lastTenGamesScore.shift();
  }
}

function controlResultValidation() {
  let roundWon = false;
  for (let i = 0; i <= 7; i++) {
    const winCondition = winConditions[i];
    let a = state[winCondition[0]];
    let b = state[winCondition[1]];
    let c = state[winCondition[2]];
    if (a === '' || b === '' || c === '') {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true;
      cells[winConditions[i][0]].classList.add('active');
      cells[winConditions[i][1]].classList.add('active');
      cells[winConditions[i][2]].classList.add('active');
      break
    }
  }
  if (roundWon) {
    statusMsg.innerHTML = 'Congratulations!';
    modal.style.display = 'flex';
    modalWinMsg.innerHTML = winMsg();
    controlCountScore();
    points = 100 - count * 10;
    lastGame = `${points} points - Player ${currentPlayer} has won in ${count} steps`;
    lastTenGamesScore.push(lastGame);
    activeGame = false;
    return;
  }
  let roundDraw = !state.includes("");
  if (roundDraw) {
    statusMsg.innerHTML = 'Game over';
    modal.style.display = 'flex';
    modalWinMsg.innerHTML = drawMsg();
    controlCountScore();
    lastGame = `10/10 points - Game ended in a draw`;
    lastTenGamesScore.push(lastGame);
    activeGame = false;
    return;
  }
  controlPlayerChange();
}

function controlCellClick(checkedCellEvent) {
  const checkedCell = checkedCellEvent.target;
  const checkedCellIndex = parseInt(checkedCell.getAttribute('data-index'));
  if (state[checkedCellIndex] !== "" || !activeGame) {
    return;
  }
  controlCellPlayed(checkedCell, checkedCellIndex);
  controlResultValidation();
}

cells.forEach(cell => cell.addEventListener('click', controlCellClick));

function controlRestartGame() {
  activeGame = true;
  currentPlayer = "X";
  state = ["", "", "", "", "", "", "", "", ""];
  count = 0;
  statusMsg.innerHTML = turnMsg();
  document.querySelectorAll('.cell').forEach(cell => {
    cell.innerHTML = "";
    cell.classList.remove('active');
    modal.style.display = 'none';
  });
}

restartBtns.forEach((item) => item.addEventListener('click', controlRestartGame));

function closeModal() {
  modal.style.display = 'none';
}

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', closeModal);

function closeScoreModal() {
  modalScore.style.display = 'none';
}

closeScoreBtn.addEventListener('click', closeScoreModal);
modalScore.addEventListener('click', closeScoreModal);

function addScore() {
  sortedTableScore = [];
  lastTenGamesScore.forEach(item => sortedTableScore.push(item));
  sortedTableScore.sort().reverse();
  let index = sortedTableScore.indexOf(lastGame);
  for (let i = 0; i < sortedTableScore.length; i++) {
    let scorePlace = document.createElement('p');
    scorePlace.classList.remove('last-game');
    scorePlace.classList.add('score-place');
    if (i === index) {
      scorePlace.classList.add('last-game');
    }
    console.log(lastGame)
    scorePlace.innerHTML = `${i + 1}) ${sortedTableScore[i]}`;
    scoreDiv.append(scorePlace);
  }
}

function showScore() {
  modalScore.style.display = 'flex';
  scoreDiv.innerHTML = '';
  addScore();
  console.log(lastTenGamesScore);
  console.log(lastGame);
}

scoreBtns.forEach((item) => item.addEventListener('click', showScore));

function setLocalStorage() {
  localStorage.setItem('score', JSON.stringify(lastTenGamesScore));
}

window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
  if (localStorage.getItem('score')) {
    const score = JSON.parse(localStorage.getItem('score'));
    lastTenGamesScore = Array.from(score);
  }
}

window.addEventListener('load', getLocalStorage);