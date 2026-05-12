const board = document.getElementById('gameBoard');
const moveCountElement = document.getElementById('moveCount');
const matchCountElement = document.getElementById('matchCount');
const restartButton = document.getElementById('restartButton');
const messageBox = document.getElementById('messageBox');
const messageText = document.getElementById('messageText');
const playAgainButton = document.getElementById('playAgainButton');

const icons = ['🍎', '🍌', '🍓', '🥝', '🍊', '🍇', '🍍', '🍉'];
let cardValues = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matches = 0;

function shuffle(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function createCard(value) {
  const card = document.createElement('button');
  card.className = 'card';
  card.type = 'button';
  card.setAttribute('aria-label', '翻牌');
  card.dataset.value = value;
  card.innerHTML = `
    <div class="card-inner">
      <div class="card-face card-back"></div>
      <div class="card-face card-front">${value}</div>
    </div>
  `;
  card.addEventListener('click', handleCardClick);
  return card;
}

function initGame() {
  board.innerHTML = '';
  cardValues = shuffle([...icons, ...icons]);
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  moves = 0;
  matches = 0;
  updateStats();
  messageBox.classList.add('hidden');

  cardValues.forEach(value => {
    const card = createCard(value);
    board.appendChild(card);
  });
}

function updateStats() {
  moveCountElement.textContent = moves;
  matchCountElement.textContent = matches;
}

function handleCardClick(event) {
  const card = event.currentTarget;
  if (lockBoard) return;
  if (card === firstCard) return;
  if (card.classList.contains('matched')) return;

  card.classList.add('flipped');

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  moves += 1;
  updateStats();
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.value === secondCard.dataset.value;
  if (isMatch) {
    disableCards();
    return;
  }
  unflipCards();
}

function disableCards() {
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');
  matches += 1;
  updateStats();
  resetBoard();

  if (matches === icons.length) {
    showMessage(`恭喜你完成了！總共 ${moves} 步。`);
  }
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetBoard();
  }, 900);
}

function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function showMessage(text) {
  messageText.textContent = text;
  messageBox.classList.remove('hidden');
}

restartButton.addEventListener('click', initGame);
playAgainButton.addEventListener('click', initGame);

initGame();
