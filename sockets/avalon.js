var User = require('../models/user');
var Avalon = require('../games/avalon/core');
var game = new Avalon.Game();
function getStatus(error) {
    let status = {
        start: game.isStarted,
        players: [],
        error: error
    };
    game.players.forEach(function(player) {
        status.players.push({
            name: player.name,
            role: player.role
        });
    });
    return status;
}
module.exports = function (io, socket) {
    socket.on('avalon-connect', function (userid) {
        socket.game = "avalon";
        socket.userid = userid;
        User.findById(userid, function (err, user) {
            game.players.push(new Avalon.Player(user._id, user.username));
            io.emit('avalon-status', getStatus());
            console.log(game.players.length + " players in Avalon");
        });
    });
    socket.on('avalon-status', function (start) {
        var error = null;
        if (start) {
            if (!game.start()) {
                error = "This number of players is not supported."
            }
        }
        else {
            game.end();
        }
        io.emit('avalon-status', getStatus(error));
    });
    socket.on('disconnect', function () {
        if (socket.game == "avalon") {
            game.players = game.players.filter((player) => {
                return player.id != socket.userid;
            });
            console.log(game.players.length + " players in Avalon");
        }
    });
}
