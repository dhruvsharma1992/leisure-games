data = require("./data");
game = data.game;
players = data.players;

module.exports = {
    createUser :  function(body, next) {
        if (body.hasOwnProperty('name')) {
            if (players.hasOwnProperty(body.name)){
                next('Duplicate name', null);
            }
            else {
                players[body.name] = {};
                next(null, data);
            }
        }
        else {
             next("Empty Body", null);
        }        
    },
    getUserStatus : function(name, next) {
        if (players.hasOwnProperty(name)) {
            next(null, players[name]);
        }
        else {
           next("player does not exist", null); 
        }
    },
    getGameStatus : function(next) {
        next(null, data);
    },
    playTurn: function(turn, player, next) {
        if (game.availableCards.length == 1) {
            game.result = 1;
            game.moves.push(turn);
            game.availableCards.shift();
            players[player].hand.shift();
            game.lastTurn = {'player':player, 'turn': turn};
        }
        else if (game.availableCards[0] == turn) {
            game.moves.push(turn);
            game.availableCards.shift();
            players[player].hand.shift();
            game.lastTurn = {'player':player, 'turn': turn};
        }
        else {
            game.result = 2; // fail
            game.moves.push(turn);
            const index = game.availableCards.indexOf(turn);
            game.availableCards.splice(index, 1);
            players[player].hand.shift();
            game.lastTurn = {'player':player, 'turn': turn};
        }
        next(null, data);
    },
    startGame: function(next) {
        if (Object.keys(players).length < 2) {
            next("Atleast 2 player needed", null);
        }
        else if (Object.keys(players).length > 10) {
            next("Max num of players is 10", null);
        }
        else {
            game.hasGameStarted = true;
            numOfCardsPerPlayer = 0;
            numOfPlayers = Object.keys(players).length;
            playerNames = Object.keys(players);
            
            if (numOfPlayers > 4) {numOfCardsPerPlayer = 2;}
            else {numOfCardsPerPlayer = 3;}
            
            totalNumOfCards = numOfPlayers * numOfCardsPerPlayer;
            
            cards = [];
            for (i=0; i< totalNumOfCards; i++)
            {
                do {
                    card = Math.ceil(Math.random()*100);
                } while(cards.indexOf(card) != -1);
                cards.push(card);
            }
            
            for (i=0; i < numOfPlayers; i++) {
                playerName = playerNames[i];
                players[playerName].hand = [];
                for (j=0; j< numOfCardsPerPlayer; j++) {
                    card = cards[numOfCardsPerPlayer*i + j];
                    players[playerName].hand.push(card);
                }
            }
            
            for (i=0; i < numOfPlayers; i++) {
                playerName = playerNames[i];
                players[playerName].hand = players[playerName].hand.sort((a,b) => a-b);
            }
            game.availableCards = cards.sort((a,b) => a-b);
            
            next(null, data);
        }
    },
    endGame: function(next) {
        game = { hasGameStarted: false, moves: [], lastTurn: {}, availableCards: [], result: 0 };
        players =  {};
        data = { game: game, players: players };
        next(null, data);
    }
}