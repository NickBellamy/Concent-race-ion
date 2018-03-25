// Flip card over on click
document.querySelector('#deck').addEventListener('click', function(e){
    if (e.target.classList.contains("front")) {
        e.target.parentNode.classList.toggle("flip");
    }
});