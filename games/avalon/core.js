var Player = /** @class */ (function () {
    function Player(id, name) {
        this.role = 0;
        this.id = id;
        this.name = name;
    }
    Player.prototype.getSide = function () {
        if (this.role == 0)
            return 0;
        else if (this.role > 0)
            return 1;
        else
            return -1;
    };
    Player.prototype.getRole = function () {
        return this.role;
    };
    Player.prototype.getRoleString = function () {
        switch (this.role) {
            case Player.OBERON: return "Oberon";
            case Player.MORGANA: return "Morgana";
            case Player.MORDRED: return "Mordred";
            case Player.ASSASSIN: return "Assassin";
            case Player.GENERIC_EVIL: return "Generic Evil";
            case Player.GENERIC_GOOD: return "Generic Good";
            case Player.MERLIN: return "Merlin";
            case Player.PERCIVAL: return "Percival";
            default: return "Unknown role";
        }
    };
    Player.prototype.setRole = function (role) {
        if (Player.ROLES.indexOf(role) != -1) {
            this.role = role;
            return true;
        }
        console.log("AvalonPlayerErrro: Role", role, "is not available.");
        return false;
    };
    Player.prototype.toString = function () {
        return "Player (name: " + this.name + ", role: " + this.getRoleString() + ")";
    };
    Player.OBERON = -5;
    Player.MORGANA = -4;
    Player.MORDRED = -3;
    Player.ASSASSIN = -2;
    Player.GENERIC_EVIL = -1;
    Player.GENERIC_GOOD = 1;
    Player.MERLIN = 2;
    Player.PERCIVAL = 3;
    Player.ROLES = [
        Player.OBERON, Player.MORGANA, Player.MORDRED, Player.ASSASSIN,
        Player.GENERIC_EVIL, Player.GENERIC_GOOD, Player.MERLIN, Player.PERCIVAL
    ];
    return Player;
}());
var Game = /** @class */ (function () {
    function Game() {
        this.round = 0;
        this.reject = 0;
        this.isStarted = false;
        this.players = [];
        this.quests = [];
    }
    Game.prototype.start = function () {
        if (this.players.length != 2 && this.players.length != 5) {
            console.log("AvalonGameError: This number of players is not supported.");
            return false;
        }
        this.currentPresidentIndex = Math.floor(Math.random() * this.players.length);
        this.randomRole();
        this.isStarted = true;
        return true;
    };
    Game.prototype.randomRole = function () {
        var roles = Game.ROLES[this.players.length].slice();
        for (var i = 0; i < this.players.length; i++) {
            var random = Math.floor(Math.random() * roles.length);
            this.players[i].setRole(roles[random]);
            roles.splice(random, 1);
        }
    };
    Game.prototype.end = function () {
        this.players.forEach(function (player) {
            player.role = 0;
        });
        this.isStarted = false;
        this.round = 0;
        this.reject = 0;
        this.quests = [];
    };
    Game.ROLES = [[],
        [], [Player.GENERIC_GOOD, Player.GENERIC_EVIL], [], [],
        [Player.GENERIC_GOOD, Player.GENERIC_GOOD, Player.MERLIN, Player.GENERIC_EVIL, Player.ASSASSIN],
    ];
    return Game;
}());
// 5 Players : 2 3 2 3 3
// 6 Players : 2 3 4 3 4
// 7 Players : 2 3 3 4 4
module.exports = {
    Game: Game,
    Player: Player
}
