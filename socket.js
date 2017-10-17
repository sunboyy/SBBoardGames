module.exports = function (server) {
    var io = require('socket.io')(server);
    io.on('connection', function (socket) {
        console.log(io.engine.clientsCount + " clients connected");
        require('./sockets/avalon')(io, socket);
        socket.on('disconnect', function() {
            console.log(io.engine.clientsCount + " clients connected");
        });
    });
}
