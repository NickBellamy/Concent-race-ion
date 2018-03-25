// Flip card over on click
document.querySelector('#deck').addEventListener('click', function(e){
    if (e.target.classList.contains("front")) {
        e.target.parentNode.classList.toggle("flip");
    }
});

let cards = [0,1,2,3,4,5,6,7]
let locations = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

cards = shuffle(cards);
locations = shuffle(locations);

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