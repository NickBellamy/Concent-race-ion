// Flip card over on click
document.querySelector('#deck').addEventListener('click', function(e){
    if (e.target.classList.contains("front")) {
        e.target.parentNode.classList.toggle("flip");
    }
});

// Can be any length - only 8 will be chosen
let cards = [1,2,3,4,5,6,7,8,9,10,11,12,13];
// Must be 16 long as each number referes to a location in the grid
let locations = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];

cards = shuffle(cards);
locations = shuffle(locations);
deal(cards, locations);

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
function deal(cards, locations) {
    for(let i=0; i < 8; i++) {
        const currentCard = cards[i];
        const locationOne = document.querySelector('.card_container:nth-child('+locations[i] + ')');
        const locationTwo = document.querySelector('.card_container:nth-child('+locations[i + 8] + ')');
        locationOne.querySelector('.back').textContent = currentCard;
        locationTwo.querySelector('.back').textContent = currentCard;
    }
}