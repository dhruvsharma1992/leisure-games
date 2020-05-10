isStarted = false;

$("#startgame").click(function() {
    $.post("/mind/start", "")
    .done(function() {
        $("#startgame").hide();
        $("#endgame").show();
    });
});

$("#endgame").click(function() {
    $.post("/mind/endgame", "")
    .done(function() {
        $("#endgame").hide();
    });
});

createPlayerCards = function(players) {
    players.forEach(player => $( "#players" ).append( "<div class=\"col-md-2 playercard\"><div>" + player + "</div></div>" ));
};

render = function(data) {
    console.log(data);
    $( "#players" ).html("");
    createPlayerCards(Object.keys(data.players));
    if (!data.game.hasGameStarted) {
        if (Object.keys(data.players).length > 1) {
            $("#startgame").show();
        }
    }
    else {
        $("#status > h2").text("Game has started");
        $("#endgame").show();
        $("#startgame").hide();
    }
};

poll = function() {
    console.log("poll");
    $.get("/mind/status/")
    .done(function(res) {
        data = res.message;
        render(data);
        if (data.game.result == 0) {
            //setTimeout(poll, 4000);
        }
    });
};

$(document).ready(function() {
    //var pwd = prompt("Enter admin password", "");
    $("#startgame").hide();
    $("#endgame").hide();
    poll();
    //$.post("/mind/admin/login", {'password': pwd})
    //.done(function() {
    //    poll();
    //})
    //.fail(function(error) {
    //    console.log(error);
    //    alert(error.responseJSON.message);
    //}); 
});