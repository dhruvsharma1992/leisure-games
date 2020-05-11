data = require("./data");
roles = require("./roles");
admin = require("./admin.data");
game = data.game;
players = data.players;

module.exports = {
    createUser:  function(body, next) {
        if (game.hasGameStarted) {
            next("Game Started. Wait for game to end.");
        }
        else {
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
        }
    },
    getUserStatus: function(name, next) {
        if (players.hasOwnProperty(name)) {
            next(null, players[name]);
        }
        else {
           next("player does not exist", null); 
        }
    },
    selectThief: function(playerName, thiefName, next) {
        if (!players.hasOwnProperty(playerName)) {
            next("player does not exist", null);
        }

        if (!players.hasOwnProperty(thiefName)) {
            next("thief does not exist", null);
        }

        player = players[playerName];
        if(player.role != roles.availableRoles.Minister || player.role != roles.availableRoles.EvilMinister){
            next("player does not have permission to select a Thief", null);
        }

        thief = players[thiefName];
        if(thief.role != roles.availableRoles.Thief || player.role != roles.availableRoles.Villager){
            next("This player cannot be selected as a Thief", null);
        }

        if(!player.thieves){
            player.thieves = [];
        }

        if(player.thieves.length == data.numOfThieves){
            next("More players cannot be added as a Thief", null);
        }

        player.thieves.push(thiefName);
        next(null, data);
    },
    unselectThief: function(playerName, thiefName, next) {
        if (!players.hasOwnProperty(playerName)) {
            next("player does not exist", null);
        }

        if (!players.hasOwnProperty(thiefName)) {
            next("thief does not exist", null);
        }

        player = players[playerName];
        if(player.role != roles.availableRoles.Minister || player.role != roles.availableRoles.EvilMinister){
            next("player does not have permission to select a Thief", null);
        }

        if(!player.thieves){
            next("nothing to unselect", null);
        }

        for(i=0; i < player.thieves.length; i++){
            if(player.thieves[i] == thiefName){
                player.thieves.splice(i, 1);
                next(null, data);
            }
        }

        next("This player was not added as a Thief", null);
    },
    doneThievesSelection: function(playerName, next) {
        if (!players.hasOwnProperty(playerName)) {
            next("player does not exist", null);
        }

        player = players[playerName];
        if(player.role != roles.availableRoles.Minister || player.role != roles.availableRoles.EvilMinister){
            next("player does not have permission to select a Thief", null);
        }

        if(!player.thieves || players.thieves.length != data.numOfThieves){
            next("Select the required number of thieves", null);
        }

        next(null, data);
    },
    selectMinister: function(playerName, ministerName, next) {
        if (!players.hasOwnProperty(playerName)) {
            next("player does not exist", null);
        }

        if (!players.hasOwnProperty(ministerName)) {
            next("minister does not exist", null);
        }

        player = players[playerName];
        if(player.role != roles.availableRoles.King){
            next("player does not have permission to select a Minister", null);
        }

        minister = players[ministerName];
        if(minister.role != roles.availableRoles.Minister || minister.role != roles.availableRoles.EvilMinister){
            next("This player cannot be selected as a Minister", null);
        }

        player.minister = ministerName;
        next(null, data);
    },
    doneMinisterSelection: function(next) {
        if (!players.hasOwnProperty(playerName)) {
            next("player does not exist", null);
        }

        player = players[playerName];
        if(player.role != roles.availableRoles.King){
            next("player does not have permission to select a Minister", null);
        }

        if(!player.minister){
            next("Select a Minister", null);
        }

        next(null, data);
    },
    startGame: function(next) {
        if (Object.keys(players).length < 5) {
            next("Atleast 5 player needed", null);
        }
        else if (Object.keys(players).length > 7) {
            next("Max num of players is 7", null);
        }
        else {
            game.hasGameStarted = true;
            numOfPlayers = Object.keys(players).length;
            playerNames = Object.keys(players);

            if (numOfPlayers == 5) { 
                numOfThieves = 1; 
                numOfVillagers = 1; 
            }
            else if (numOfPlayers == 6) { 
                numOfThieves = 1; 
                numOfVillagers = 2; 
            }
            else { 
                numOfThieves = 2; 
                numOfVillagers = 2; 
            }

            data.numOfThieves = numOfThieves;
            neededRoles = [roles.availableRoles.King, roles.availableRoles.Minister, roles.availableRoles.EvilMinister]
            for(i=0; i < numOfThieves; i++){
                neededRoles.push(roles.availableRoles.Thief);
            }
            for(i=0; i < numOfVillagers; i++){
                neededRoles.push(roles.availableRoles.Villager);
            }

            rolesToAssign = neededRoles.length - 1;
            while (rolesToAssign >= 0) {
                playerPos = Math.floor(Math.random()*numOfPlayers);

                temp = playerNames[playerPos];
                playerNames[playerPos] = playerNames[rolesToAssign];
                playerNames[rolesToAssign] = temp;

                players[temp].role = neededRoles[rolesToAssign];
            }
            
            next(null, data);
        }
    },
    endGame: function(next) {
        game = { hasGameStarted: false, result: 0 };
        players =  {};
        data = { game: game, players: players };
        next(null, data);
    }
}