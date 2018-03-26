/* Event Handlers */

// Flip card over on click if face down
document.querySelector('#deck').addEventListener('click', function (e) {
    const clickedCard = e.target.parentNode;
    // Only true if card is face down ("flipped" class not applied)
    if (clickedCard.classList.value === "card") {
        flipCard(clickedCard);
        gameState.storeCardId(clickedCard.dataset.identifier);

        let clickResult = gameState.checkMatch();

        if(clickResult === gameState.CLICKRESULT.NOMATCH) {
            setTimeout(function () {
                flipCard(document.querySelector('.card[data-identifier="' + gameState.cardId1 + '"].flipped'))
            }, 500);
            setTimeout(function () {
                flipCard(document.querySelector('.card[data-identifier="' + gameState.cardId2 + '"].flipped'))
            }, 500);
        } else if (clickResult === gameState.CLICKRESULT.WIN) {
            alert("You Win!!  You made " + gameState.falseMoves + " false moves.");
        }
    }
});

// Event handler for the Restart button
document.querySelector('#restart a').addEventListener('click', function (e) {
    e.preventDefault;
    reset();
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
        const locationOne = document.querySelector('.card_container:nth-child(' + locations[i] + ')');
        const locationTwo = document.querySelector('.card_container:nth-child(' + locations[i + 8] + ')');
        locationOne.querySelector('.back').textContent = currentCard;
        locationOne.querySelector('.card').dataset.identifier = i;
        locationTwo.querySelector('.back').textContent = currentCard;
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

function reset() {
    gameState.falseMoves = 0;
    gameState.matchCount = 0;
    flipCardsDown();
    shuffledCards = shuffle(cards);
    randomisedLocations = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    // setTimeout delays dealing until the flip animation has finished flipping cards face down
    setTimeout(function () { deal(shuffledCards, randomisedLocations) }, 500);
}

const gameState = {
    CLICKRESULT: {
        MATCH: "Match",
        NULLMATCH: "Null Match",
        NOMATCH: "No Match",
        WIN: "Win"
    },
    falseMoves: 0,
    matchCount: 0,
    cardId1: null,
    cardId2: null,
    checkMatch: function () {
        if (this.cardId2 === null) {
            return this.CLICKRESULT.NULLMATCH;
        } else if (this.cardId1 === this.cardId2) {
            this.matchCount++;
            console.log(this.matchCount);
            return this.matchCount >= 8 ? this.CLICKRESULT.WIN : this.CLICKRESULT.MATCH;
        } else {
            this.falseMoves++;
            return this.CLICKRESULT.NOMATCH;
        }
    },
    // Stores clicked card id and returns the value location in which it is stored
    storeCardId: function (clickedCard) {
        if (this.cardId1 === null || this.cardId2 !== null) {
            this.cardId1 = clickedCard;
            this.cardId2 = null;
        } else {
            this.cardId2 = clickedCard;
        }
    }
}

/* Main program loop */

// Can be any length - only 8 will be chosen
let cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

reset();