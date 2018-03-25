/* Event Handlers */

// Flip card over on click if face down
document.querySelector('#deck').addEventListener('click', function (e) {
    // Only true if card is face down ("flipped" class not applied)
    if (e.target.parentNode.classList.value === "card") {
        flipCard(e.target.parentNode);
        if (matchState.value1 === null || matchState.value2 !== null) {
            matchState.value1 = e.target.parentNode.dataset.identifier;
            matchState.value2 = null;
        } else {
            matchState.value2 = e.target.parentNode.dataset.identifier;
            // If match is made
            if (matchState.checkMatch()) {
                matchState.matchCount++;
                // Check for win
                if (matchState.matchCount >= 8) {
                    alert("You Win!!  You made " + matchState.falseMoves + " false moves.");
                }
            // Else checkMatch is not true; flip all cards that are "flipped" with the identifier values in matchState.
            } else {
                matchState.falseMoves++;
                setTimeout(function () {
                    flipCard(document.querySelector('.card[data-identifier="' + matchState.value1 + '"].flipped'))
                }, 500);
                setTimeout(function () {
                    flipCard(document.querySelector('.card[data-identifier="' + matchState.value2 + '"].flipped'))
                }, 500);
            }
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
    matchState.falseMoves = 0;
    matchState.matchCount = 0;
    flipCardsDown();
    shuffledCards = shuffle(cards);
    randomisedLocations = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    // setTimeout delays dealing until the flip animation has finished flipping cards face down
    setTimeout(function () { deal(shuffledCards, randomisedLocations) }, 500);
}

const matchState = {
    falseMoves: 0,
    matchCount: 0,
    value1: null,
    value2: null,
    checkMatch: function () {
        return this.value1 === this.value2 ? true : false;
    }
}

/* Main program loop */

// Can be any length - only 8 will be chosen
let cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

reset();