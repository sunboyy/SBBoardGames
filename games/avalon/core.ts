class Player {
    public static readonly OBERON = -5;
    public static readonly MORGANA = -4;
    public static readonly MORDRED = -3;
    public static readonly ASSASSIN = -2;
    public static readonly GENERIC_EVIL = -1;
    public static readonly GENERIC_GOOD = 1;
    public static readonly MERLIN = 2;
    public static readonly PERCIVAL = 3;

    public static readonly ROLES = [
        Player.OBERON, Player.MORGANA, Player.MORDRED, Player.ASSASSIN,
        Player.GENERIC_EVIL, Player.GENERIC_GOOD, Player.MERLIN, Player.PERCIVAL];
    public id: string;
    public name: string;
    public role = 0;
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
    public getSide(): number {
        if (this.role == 0) return 0;
        else if (this.role > 0) return 1;
        else return -1;
    }
    public getRole(): number {
        return this.role;
    }
    public getRoleString(): string {
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
    }
    public setRole(role: number): boolean {
        if (Player.ROLES.indexOf(role) != -1) {
            this.role = role;
            return true;
        }
        console.log("AvalonPlayerErrro: Role", role, "is not available.");
        return false;
    }
    public toString(): string {
        return "Player (name: " + this.name + ", role: " + this.getRoleString() + ")";
    }
}
class Game {
    public static readonly ROLES = [[],
    [], [], [], [],
    [Player.GENERIC_GOOD, Player.GENERIC_GOOD, Player.MERLIN, Player.GENERIC_EVIL, Player.ASSASSIN],
    ]
    public players: Player[];
    private quests: number[];
    private round = 0;
    private reject = 0;
    private currentPresidentIndex: number;
    public isStarted = false;
    constructor() {
        this.players = [];
        this.quests = [];
    }
    public start(): boolean {
        if (this.players.length > 5 || this.players.length < 5) {
            console.log("AvalonGameError: This number of players is not supported.")
            return false;
        }
        this.currentPresidentIndex = Math.floor(Math.random() * this.players.length);
        this.randomRole();
        this.isStarted = true;
        return true;
    }
    private randomRole() {
        var roles = Game.ROLES[this.players.length].slice();
        for (let i = 0; i < this.players.length; i++) {
            let random = Math.floor(Math.random() * roles.length);
            this.players[i].setRole(roles[random]);
            roles.splice(random, 1);
        }
    }
    public end() {
        this.players.forEach(function(player) {
            player.role = 0;
        });
        this.isStarted = false;
        this.round = 0;
        this.reject = 0;
        this.quests = [];
    }
}

// 5 Players : 2 3 2 3 3
// 6 Players : 2 3 4 3 4
// 7 Players : 2 3 3 4 4

// module.exports = {
//     Game: Game,
//     Player: Player
// }

var game = new Game();
game.players.push(new Player("1", "A"));
game.players.push(new Player("2", "B"));
game.players.push(new Player("3", "C"));
game.players.push(new Player("4", "D"));
game.players.push(new Player("5", "E"));
game.start();
console.log("" + game.players);