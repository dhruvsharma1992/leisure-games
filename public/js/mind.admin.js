isStarted = false;

$("#start").click(function() {
    $.post("/mind/start", "")
    .done(function() {
        $("#start").hide();
        $("#endgame").show();
    });
});

$("#endgame").click(function() {
    $.post("/mind/endgame", "")
    .done(function() {
        $("#endgame").hide();
    });
});

poll = function() {
    console.log("poll");
    $.get("/mind/status/")
    .done(function(res) {
        data = res.message;
        render(data);
        if (data.game.result) {
            if (!isStarted && Object.keys(data.players).length > 0) {
                $("#start").show();
            }
            setTimeout(poll, 2000);
        }
    });
};

$(document).ready(function() {
    var pwd = prompt("Enter admin password", "");
    $.post("/mind/admin/login", pwd)
    .done(function() {
        poll();
    })
    .fail(function(error) {
        alert(error.responseJSON.message);
    }); 
});