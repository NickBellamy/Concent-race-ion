/* Game Settings */


const settings = {
    // Number of moves in which player is awarded 2 stars
    TWOSTARS: 10,
    // Number of moves in which player is awarded 1 star
    ONESTAR: 15,
    // List of cards to play with
    CARDS: ['Alain_Prost.png',
        'Gunnar_Nilsson.png',
        'Piers_Courage.png',
        'Ayrton_Senna.png',
        'Jackie_Stewart.png',
        'Roger_Williamson.png',
        'Damon_Hill.png',
        'James_Hunt.png',
        'Roland_Ratzenber.png',
        'David_Purley.png',
        'Jody_Scheckter.png',
        'Rolf_Stommelen.png',
        'Francois_Cevert.png',
        'Maria_de_Villota.png',
        'Ronnie_Peterson.png',
        'Gerhard_Berger.png',
        'Mario_Andretti.png',
        'Stefan_Bellof.png',
        'Gilles_Villeneuve.png',
        'Niki_Lauda.png',
        'Tom_Pryce.png']
}

/* Event Handlers */

// Flip card over on click if face down
document.querySelector('#deck').addEventListener('click', function (e) {
    const clickedCard = e.target.parentNode;
    // Only true if card is face down ("flipped" class not applied)
    if (clickedCard.classList.value === 'card') {
        // cardId1 is only null at the beginning of the game
        if (gameState.cardId1 === null) {
            stopWatch.startTimer();
        }
        flipCard(clickedCard);
        gameState.storeCardId(clickedCard.dataset.identifier);

        // For a NOMATCH result below, these local copies can be used as flipCard target rather than relying
        // on the values in gameState which will have changed if user has clicked another card within the 500ms
        // setTimeout interval.  This ensures on a NOMATCH, the correct cards will be flipped back face down.
        const clickedCards = [gameState.cardId1, gameState.cardId2];

        const clickResult = gameState.checkMatch();

        if (clickResult === gameState.CLICKRESULT.NOMATCH) {
            // Flip both cards face down briefly after both being revealed.
            clickedCards.forEach(function (card) {
                setTimeout(function () {
                    flipCard(document.querySelector('.card[data-identifier="' + card + '"].flipped'))
                }, 500);
            })
        } else if (clickResult === gameState.CLICKRESULT.WIN) {
            stopWatch.stopTimer();
            Ui.showModal();
        }
    }
});

// Event handler for resetting the game
document.querySelector('#restart, #play-again-yes').addEventListener('click', function (e) {
    reset();
})

// Event handler for closing the modal
document.querySelector('#modal, #play-again-no, #play-again-yes').addEventListener('click', function () {
    document.querySelector('#modal').style.display = 'none';
})

/* Card Mechanics */

// Randomises the order of items in an array using the Fisher-Yates shuffle
// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
function shuffle(array) {
    let currentIndex = array.length;

    while (currentIndex > 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // Swap values at currentIndex and randomIndex
        const temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Deal 2 of each of the first 8 cards in cards, to each location in locations
// dataset.identifier property is used to identify matching pairs of cards
function deal(cards, locations) {
    for (let i = 0; i < 8; i++) {
        const currentCard = cards[i];
        const locationOne = document.querySelector('.card-container:nth-child(' + locations[i] + ')');
        const locationTwo = document.querySelector('.card-container:nth-child(' + locations[i + 8] + ')');
        locationOne.querySelector('.back').style.backgroundImage = 'url(./img/' + currentCard + ')';
        locationOne.querySelector('.card').dataset.identifier = i;
        locationTwo.querySelector('.back').style.backgroundImage = 'url(./img/' + currentCard + ')';
        locationTwo.querySelector('.card').dataset.identifier = i;
    }
}

// Toggle a single card between face up and face down states
function flipCard(card) {
    card.classList.toggle('flipped');
}

// Flip all face up cards, face down
function flipCardsDown() {
    const flippedCards = document.querySelectorAll('.flipped');
    flippedCards.forEach(
        function (card) {
            flipCard(card);
        }
    )
}

/* Timer */

const stopWatch = {
    startTime: null,
    timer: function () {
        const elapsedTime = Date.now() - stopWatch.startTime;
        document.querySelector('#timer span').innerHTML = (elapsedTime / 1000).toFixed(3);
    },
    startTimer: function () {
        this.startTime = Date.now();
        stopWatch.timerInstance = setInterval(this.timer, 10);
    },
    stopTimer: function () {
        clearInterval(stopWatch.timerInstance);
    }
}

function reset() {
    stopWatch.stopTimer();
    gameState.reset();
    Ui.reset();
    flipCardsDown();
    // setTimeout delays dealing until the flip animation has finished flipping cards face down
    setTimeout(function () { beginGame() }, 350);
}

function beginGame() {
    shuffledCards = shuffle(settings.CARDS);
    randomisedLocations = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    deal(shuffledCards, randomisedLocations)
}

/* UI */

const Ui = {
    updateMoveCount: function (moves) {
        document.querySelector('#moves span').textContent = moves;
    },
    removeStar: function () {
        const firstStar = document.querySelector('.full-star');
        firstStar.classList.remove('full-star');
        firstStar.classList.add('empty-star');
        firstStar.textContent = 'star_border';
    },
    showModal: function () {
        document.querySelector('#final-score').innerHTML = document.querySelector('#stars').innerHTML;
        document.querySelector('#winning-message').innerHTML =
            'You made <b>' + gameState.moves + '</b> moves and finished in <b>' + document.querySelector('#timer span').innerHTML + '</b> seconds!';
        document.querySelector('#modal').style.display = 'block';
    },
    reset: function () {
        document.querySelector('#timer span').textContent = '0.000';
        document.querySelector('#moves span').textContent = 0;
        const stars = document.querySelectorAll('#stars i');
        stars.forEach(
            function (star) {
                star.classList.remove('empty-star');
                star.classList.add('full-star');
                star.textContent = 'star';
            }
        )
    }
}


const gameState = {
    CLICKRESULT: {
        MATCH: 'Match',
        NULLMATCH: 'Null Match',
        NOMATCH: 'No Match',
        WIN: 'Win'
    },
    moves: 0,
    matchCount: 0,
    cardId1: null,
    cardId2: null,
    checkMatch: function () {
        if (this.cardId2 === null) {
            return this.CLICKRESULT.NULLMATCH;
        } else if (this.cardId1 === this.cardId2) {
            this.incrementMoveCount();
            return ++this.matchCount >= 8 ? this.CLICKRESULT.WIN : this.CLICKRESULT.MATCH;
        } else {
            this.incrementMoveCount();
            return this.CLICKRESULT.NOMATCH;
        }
    },
    // Stores clicked card id
    storeCardId: function (clickedCard) {
        if (this.cardId1 === null || this.cardId2 !== null) {
            this.cardId1 = clickedCard;
            this.cardId2 = null;
        } else {
            this.cardId2 = clickedCard;
        }
    },
    incrementMoveCount: function () {
        Ui.updateMoveCount(++this.moves);
        if (this.moves === settings.TWOSTARS || this.moves === settings.ONESTAR) {
            Ui.removeStar();
        }
    },
    reset: function () {
        this.moves = 0;
        this.matchCount = 0;
        this.cardId1 = null;
        this.cardId2 = null;
    }
}

beginGame();