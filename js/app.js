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


// Event handler for flipping cards
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

        // For a NOMATCH result below, these local card ids can be used as flipCard target rather than relying
        // on the values in gameState which will have changed if user has clicked another card within the 500ms
        // setTimeout interval.  This ensures on a NOMATCH, the correct cards will be flipped back face down.
        const clickedCards = [gameState.cardId1, gameState.cardId2];

        // Returns a gamesState.CLICKRESULT
        const clickResult = gameState.checkMatch();

        if (clickResult === gameState.CLICKRESULT.NOMATCH) {
            // Flip both cards face down briefly after (500ms) both being revealed.
            clickedCards.forEach(function (card) {
                setTimeout(function () {
                    flipCard(document.querySelector('.card[data-identifier="' + card + '"].flipped'))
                }, 500);
            })
        } else if (clickResult === gameState.CLICKRESULT.WIN) {
            stopWatch.stopTimer();
            // Show win message
            ui.showModal();
        }
    }
});

// Event handler for resetting the game
document.querySelectorAll('#restart, #play-again-yes').forEach(function (resetItem) {
    resetItem.addEventListener('click', function () {
        reset();
    })
})

// Event handler for closing the modal
document.querySelectorAll('#modal, #play-again-no, #play-again-yes').forEach(function (closeModalItem) {
    closeModalItem.addEventListener('click', function () {
        ui.hideModal();
    })
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

// Deal 2 of each of the first 8 cards in cards array, to two random board locations
// dataset.identifier property is set to identify matching pairs of cards during the game
function deal() {
    const shuffledCards = shuffle(settings.CARDS)
    const shuffledLocations = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

    for (let i = 0; i < 8; i++) {
        const currentCard = shuffledCards[i];
        const locations = [];
        locations[0] = document.querySelector('.card-container:nth-child(' + shuffledLocations[i] + ')');
        locations[1] = document.querySelector('.card-container:nth-child(' + shuffledLocations[i + 8] + ')');
        locations.forEach(function (location) {
            location.querySelector('.back').style.backgroundImage = 'url(./img/' + currentCard + ')';
            location.querySelector('.card').dataset.identifier = i;
        })
    }
}

// Toggle a single card between face up and face down states
function flipCard(card) {
    card.classList.toggle('flipped');
}

// Flip all face up cards, face down
function flipCardsDown() {
    const flippedCards = document.querySelectorAll('.flipped');
    flippedCards.forEach(function (card) {
        flipCard(card);
    })
}


/* Timer */


const stopWatch = {
    startTime: null,
    // Calculates the interval since the timer started and passes the value to the UI to update
    timer: function () {
        const elapsedTime = Date.now() - stopWatch.startTime;
        ui.updateTime(elapsedTime);
    },
    startTimer: function () {
        this.startTime = Date.now();
        stopWatch.timerInstance = setInterval(this.timer, 10);
    },
    stopTimer: function () {
        clearInterval(stopWatch.timerInstance);
    }
}


/* UI */


// Responsible for updating UI elements
const ui = {
    updateTime: function (time) {
        document.querySelector('#timer span').innerHTML = (time / 1000).toFixed(3);
    },
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
            `You made <b> ${gameState.moves} </b> moves and finished in <b> ${document.querySelector('#timer span').innerHTML} </b> seconds!`;
        document.querySelector('#modal').style.display = 'block';
    },
    hideModal: function () {
        document.querySelector('#modal').style.display = 'none';
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


/* State Engine */


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
    // Returns CLICKRESULT based on match conditions
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
    // Increments move count and calls to UI to update move count on screen
    // Then triggers UI to remove a star if move threshold in settings has been reached
    incrementMoveCount: function () {
        ui.updateMoveCount(++this.moves);
        if (this.moves === settings.TWOSTARS || this.moves === settings.ONESTAR) {
            ui.removeStar();
        }
    },
    // Reset gameState
    reset: function () {
        this.moves = 0;
        this.matchCount = 0;
        this.cardId1 = null;
        this.cardId2 = null;
    }
}

// Resets entire application
function reset() {
    stopWatch.stopTimer();
    gameState.reset();
    ui.reset();
    flipCardsDown();
    // setTimeout delays dealing until the flip animation has finished flipping cards face down
    // Note: 350ms is chosen as it is half of the transition duration of the flip effect
    setTimeout(function () { deal() }, 350);
}


/* Begin Game */


deal();