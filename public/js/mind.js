user = null;
hand = [];
gameHasStarted = false;

$("#playcard").click(function() {
    card = hand[0];
    hand.shift();
    $.post("playturn", {"turn": Number(card), 'player': user})
    .done(function(res) {
        data = res.message;
        render(data);
    });
});

$("#newuser > form").submit(function(e) {
    e.preventDefault();
    val = $("#user").val();
    $.post("/mind/createuser",
    {
        name: val,
    })
    .done(function(data) {
      console.log("Data: " + JSON.stringify(data) + "\nStatus: " + status);
      sessionStorage.setItem("user", val);
      user = val;
      $("#message").text("");
      $("#newuser").hide();
      poll();
    })
    .fail(function(error) {
        $("#message").text(error.responseJSON.message);
    }) ;
});

render = function(data) {
    $( "#moves > .moves" ).html("");
    data.game.moves.forEach(move => $( "#moves > .moves" ).append( "<div class=\"col-md-2 card\"><div>" + move + "</div></div>" ));
    if (data.game.result == 0) {
        hand = data.players[user].hand;
        if (hand.length == 0) {
            $("#hand > button").hide();
            $("#hand > div").text("");
        }
        else {
            if(data.game.hasOwnProperty("lastTurn") && data.game.lastTurn.hasOwnProperty("player"))
            {
                $("#status > h2").text(data.game.lastTurn.player + " played " + data.game.lastTurn.turn);
            }
            $("#cards").html("");
            hand.forEach(card => $("#cards").append( "<div class=\"col-md-3 card\"><div>" + card + "</div></div>" ));
            $("#playcard").text("play "+ hand[0]);
        }
    }
    else if (data.game.result == 1) {
        $("#status > h2").text("YOU WON");
        $("#hand").hide();
    }
    else if (data.game.result == 2) {
        $("#status > h2").text("YOU LOOSE " + "Lowest Card available: " + data.game.availableCards[0]);
        $("#hand").hide();
    }
};

poll = function() {
    console.log("poll");
    $.get("/mind/status/")
    .done(function(res) {
        data = res.message;
        console.log(JSON.stringify(data));
        if (!gameHasStarted && data.game.hasGameStarted) {
            $("#waiting").hide();
            gameHasStarted = true;
            $("#game").show();
        }        
        if(gameHasStarted) {
            if(!data.game.hasGameStarted) {
                gameHasStarted = false;
                alert("Game ended.");
                $("#game").hide();
                $("#newuser").show();
                $("#waiting").hide();
                user = null;
                gameHasStarted = false;
                console.log("endgame");
            }
            else {
                render(data);
            }
        }
        else {
            $("#waiting").show();
        }
    })
    .always(function() {
        if (user) { setTimeout(poll, 2000); }
    });
};

$(document).ready(function(){
    $("#newuser").hide();
    $("#waiting").hide();
    $("#game").hide();
    user = sessionStorage.getItem("user");
    if (user != null) {        
        $.get("/mind/status/")
        .done(function(res) {
            data = res.message;
            console.log(JSON.stringify(data));
            if (!data.players.hasOwnProperty(user)) {
                if (data.game.hasGameStarted) {
                    alert("Game in progress. Please come back later");
                }
                else {
                    $("#newuser").show();
                }
            }
            else if (data.players.hasOwnProperty(user)) {
                $("#newuser").hide();
                poll();
            }
        });
    }
    else {
        $("#newuser").show();
    }
});