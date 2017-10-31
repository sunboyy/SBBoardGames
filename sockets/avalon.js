var User = require('../models/user');
var Avalon = require('../games/avalon/core');
var game = new Avalon.Game();
function getStatus(error) {
    let status = {
        start: game.isStarted,
        players: [],
        error: error
    };
    game.players.forEach(function (player) {
        status.players.push({
            name: player.name,
            role: player.role,
            id: player.id
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
            io.emit('avalon-status', getStatus(null));
            console.log(game.players.length + " players in Avalon");
        });
    });
    socket.on('avalon-status', function (start) {
        if (start) {
            if (!game.start()) {
                return socket.emit('avalon-status', getStatus("This number of players is not supported."));
            }
        }
        else {
            game.end();
        }
        io.emit('avalon-status', getStatus(null));
    });
    socket.on('disconnect', function () {
        if (socket.game == "avalon") {
            game.players = game.players.filter((player) => {
                return player.id != socket.userid;
            });
            io.emit('avalon-status', getStatus(null));
            console.log(game.players.length + " players in Avalon");
        }
    });
}
