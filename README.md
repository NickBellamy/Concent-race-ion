# Concent-race-ion
A web based racing themed matching card game based on Concentration.  The aim of the game is to match all pairs of cards on the game board in the fewest moves possible.  This project is part of the Udacity Nanodegree program. 

**The following criteria must be met:**

* The game randomly shuffles the cards. A user wins once all cards have successfully been matched
* When a user wins the game, a modal appears to congratulate the player and ask if they want to play again. It should also tell the user how much time it took to win the game, and what the star rating was
* A restart button allows the player to reset the game board, the timer, and the star rating
* The game displays a star rating (from 1-3) that reflects the player's performance. At the beginning of a game, it should display 3 stars. After some number of moves, it should change to a 2 star rating. After a few more moves, it should change to a 1 star rating
* The number of moves needed to change the rating is up to you, but it should happen at some point
* When the player starts a game, a displayed timer should also start. Once the player wins the game, the timer stops
* Game displays the current number of moves a user has made
* Application uses CSS to style components for the game
* All application components are usable across modern desktop, tablet, and phone browsers
* A README file is included detailing the game and all dependencies
* Comments are present and effectively explain longer code procedure when necessary
* Code is formatted with consistent, logical, and easy-to-read formatting as described in the [Udacity JavaScript Style Guide](https://udacity.github.io/frontend-nanodegree-styleguide/javascript.html)

## Technologies used

The entire project has been written from the ground up using HTML, CSS, and pure JavaScript.

## Playing the game

Click on a card to flip it over, and the timer will begin.  Clicking a second card will flip it over, and if it matches the first card then both cards will stay revealed.  If there isn't a match, then both cards will flip face down.

Continue to try and match cards in the fewest moves possible!

Once all pairs of cards have been matched, a star rating will be shown giving you a score based on the number of moves it took you to match all the cards on the board.  Additionally, the time it took to match all the cards will be shown too - can you beat your fastest time?!

## Altering the difficulty

To make the game easier or harder, open the `app.js` file in the `js` folder and you will see the `settings` namespace at the beginning of the file.
```
/* Game Settings */


const settings = {
    // Number of moves in which player is awarded 2 stars
    TWOSTARS: 10,
    // Number of moves in which player is awarded 1 star
    ONESTAR: 15,
    // List of cards to play with
    CARDS: [
        'Alain_Prost.png',
        'Gunnar_Nilsson.png',
        'Piers_Courage.png',
        'Ayrton_Senna.png'...
...}
```

All games start with 3 stars awarded, then the score decrements to 2 stars at the move number set with `settings.TWOSTARS`, and finally decrementing to one star at the move number set with `settings.ONESTAR`.

To make the game easier, increase both these values.  To make it harder, decrease these values (although remember that a perfect game still requires at least 8 moves!).


## Acknowledgments

All images provided by [Pitlane02](https://commons.wikimedia.org/wiki/User:Pitlane02) under the [Creative Commons Attribution-ShareAlike 3.0 Unported License](https://creativecommons.org/licenses/by-sa/3.0/legalcode)
