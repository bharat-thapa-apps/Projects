const score = JSON.parse(localStorage.getItem('score')) || {
  wins: 0,
  losses: 0,
  ties: 0,
};

const moves = ['rock', 'paper', 'scissors'];
const getRandomMove = () => {
  const randomIndex = Math.floor(Math.random() * moves.length);
  return moves[randomIndex];
};

// const userWinCon = [
//   ['rock', 'scissors'],
//   ['paper', 'rock'],
//   ['scissors', 'paper'],
// ];
// const userLoseCon = [
//   ['rock', 'paper'],
//   ['paper', 'scissors'],
//   ['scissors', 'rock'],
// ];

// const getResult = (userMove, computerMove) => {
//   if (userMove === computerMove) return 'tie';
//   else if (
//     userWinCon.find((con) => con[0] === userMove && con[1] === computerMove)
//   ) {
//     return 'win';
//   } else if (
//     userLoseCon.find((con) => con[0] === userMove && con[1] === computerMove)
//   ) {
//     return 'lose';
//   }
// };

const winConditions = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper',
};

const getResult = (playerMove, computerMove) => {
  if (playerMove === computerMove) return 'tie';
  return winConditions[playerMove] === computerMove ? 'win' : 'lose';
};

const resultElement = document.querySelector('.js-result');
const updateResult = (result) => {
  if (!result) {
    resultElement.innerText = 'Tie.';
    return;
  }
  resultElement.innerText = `You ${result}.`;
};

const scoreElement = document.querySelector('.js-score-card');
const updateScoreCard = () => {
  scoreElement.innerText = `Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
};
updateScoreCard();

const movesInfoElement = document.querySelector('.js-moves-info');
const updateMovesInfo = (userMove, computerMove) => {
  movesInfoElement.innerHTML = `
<span class="moves-info">You <img class="moves-info-img" src="images/${userMove}.png" alt="${userMove}"></span>
<span class="moves-info"><img class="moves-info-img" src="images/${computerMove}.png" alt="${computerMove}">Computer</span>
`;
};

const saveToLocalStorage = () => {
  localStorage.setItem('score', JSON.stringify(score));
};

const promptDisplayElement = document.querySelector('.reset-prompt');
const generatePromptElement = () => {
  const HTML = `
<span class="prompt">Are you sure you want to reset your score?</span> 
<button class="js-prompt-button" data-button="yes">Yes</button>
<button class="js-prompt-button" data-button="no">No</button>
`;
  promptDisplayElement.innerHTML = HTML;

  const buttonElements = document.querySelectorAll('.js-prompt-button');
  buttonElements.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.button === 'yes') {
        resetScore();
        promptDisplayElement.innerHTML = '&nbsp;';
      } else {
        promptDisplayElement.innerHTML = '&nbsp;';
      }
    });
  });
};

function resetScore() {
  score.wins = 0;
  score.losses = 0;
  score.ties = 0;
  saveToLocalStorage();
  updateScoreCard();
}

const moveButtonElements = document.querySelectorAll('.js-move-buttons');

const autoPlayButton = document.querySelector('.js-autoplay');
let isAutoPlaying = false;
let intervalId = null;

const autoPlay = (enable) => {
  if (enable) {
    if (intervalId) return;
    isAutoPlaying = true;
    moveButtonElements.forEach((button) => {
      button.disabled = true;
      button.classList.add('disabled');
    });
    autoPlayButton.innerText = 'Stop AutoPlay';
    autoPlayButton.classList.add('autoplaying');
    intervalId = setInterval(() => {
      const randomPlayerMove = getRandomMove();
      playGame(randomPlayerMove);
    }, 1000);
  } else {
    clearInterval(intervalId);
    intervalId = null;
    isAutoPlaying = false;
    moveButtonElements.forEach((button) => {
      button.disabled = false;
      button.classList.remove('disabled');
    });
    autoPlayButton.classList.remove('autoplaying');
    autoPlayButton.innerText = 'Auto Play';
  }
};

const playGame = (userMove) => {
  const computerMove = getRandomMove();
  const result = getResult(userMove, computerMove);
  if (result === 'win') {
    score.wins++;
    updateResult(result);
  } else if (result === 'lose') {
    score.losses++;
    updateResult(result);
  } else if (result === 'tie') {
    score.ties++;
    updateResult();
  }
  updateScoreCard();
  updateMovesInfo(userMove, computerMove);
  saveToLocalStorage();
};

const setupEventListener = () => {
  document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'r' && !event.ctrlKey && !isAutoPlaying)
      playGame('rock');
    else if (event.key.toLowerCase() === 'p' && !isAutoPlaying)
      playGame('paper');
    else if (event.key.toLowerCase() === 's' && !isAutoPlaying)
      playGame('scissors');
    else if (event.key === ' ') {
      if (!isAutoPlaying) {
        autoPlay(true);
      } else {
        autoPlay(false);
      }
    }
    if (event.ctrlKey && event.key.toLowerCase() === 'r') {
      event.preventDefault();
      generatePromptElement();
    }
  });
  moveButtonElements.forEach((button) => {
    button.addEventListener('click', () => {
      playGame(button.dataset.move);
    });
  });

  document
    .querySelector('.js-reset-score')
    .addEventListener('click', generatePromptElement);
  autoPlayButton.addEventListener('click', () => {
    if (!isAutoPlaying) {
      autoPlay(true);
    } else {
      autoPlay(false);
    }
  });
};

setupEventListener();
