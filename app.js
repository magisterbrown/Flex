var express = require("express");
var http = require("http");
const websocket = require("ws");

var port = process.argv[2];
var app = express();

var active = 0;
var completed = 0;
var ids = 0;
var games = [];
let queue = null;

app.use(express.static(__dirname + "/public"));
http.createServer(app).listen(port);

app.get("/", function (req, res) {
    res.sendFile("splash.html", { root: "./public", games: active });
});

app.get("/game", function (req, res) {
    res.sendFile("game.html", { root: "./public" });
});

const server = http.createServer(app);
const wss = new websocket.Server({ server });
wss.on("connection", function (ws) {

    ws.on("message", function incoming(message) {
        message = JSON.parse(message);
        if (message.type == "start") {
            ws.player = new Player();
            if (queue == null) {
                ws.player.setType("creator");
                queue = new Game(ws);
            }
            else {
                ws.player.setType("participant");
                queue.addPlayer(ws);
                queue.sate = "full";
                queue = null;
                active++;
            }
            let mess = new Message("active", active);
            sendActive(wss, websocket, mess);
        }

        if (message.type == "turn") {
            if (ws.player.type == "participant") {
                var x = message.data;
                console.log("PARTICIPANT");

                if (ws.game.allMoves[x] != null) {
                    let invalid = new Message("Invalid Move", 0);
                    ws.send(JSON.stringify(invalid));



                }
                else {
                    var curHex = new Hex("participant", x);
                    ws.game.allMoves[x] = curHex;
                    let move = new Message("ParticipantMove", x);
                    ws.game.participant.send(JSON.stringify(move));
                    ws.game.creator.send(JSON.stringify(move));


                }
            }
            else if (ws.player.type == "creator") {

                var x = message.data;
                console.log("CREATOR");
                if (ws.game.allMoves[x] != null) {
                    let invalid = new Message("Invalid Move", 0);
                    ws.send(JSON.stringify(invalid));



                }
                else {
                    var curHex = new Hex("creator", x);
                    ws.game.allMoves[x] = curHex;
                    let move = new Message("CreatorMove", x);
                    ws.game.participant.send(JSON.stringify(move));
                    ws.game.creator.send(JSON.stringify(move));


                }

            }
        }
        if (message.type == "currgames") {
            let mass = new Message("active", active);
            ws.send(JSON.stringify(mass));
        }

    });
    ws.on("close", function incoming() {
        if (ws.game != null) {
            if (ws.game.sate == "full") {
                active--;
                let mess = new Message("active", active);
                sendActive(wss, websocket, mess);
                ws.game.sate = "waiting";
            }
            if (ws.game.creator != null) {
                ws.game.creator.close();
            }
            if (ws.game.participant != null) {
                ws.game.participant.close();
            }

        }
    });
});
function sendActive(wss, WebSocket, data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

function Message(type, data) {
    this.type = type;
    this.data = data;
}
function Player() {
    this.type;
    this.setType = function (type) {
        this.type = type;
    }
}
function Game(ws) {
    this.sate = "waiting";
    this.creator = ws;
    this.move = "creator";
    this.allMoves = [];
    ws.game = this;
    this.addPlayer = function (ws) {
        this.participant = ws;
        ws.game = this;
    }

}
server.listen(3001);




function Hex(player, id) {
    this.state = player;
    this.id = id;

}


var boardValues = {
    1: "A1", 
    2: "B1", 3: "A2", 
    4: "C1", 5: "B2", 6: "A3",
    7: "D1", 8: "C2", 9: "B3", 10:"A4",
    11:"E1", 12:"D2", 13:"C3", 14:"B4", 15:"A5",
    16:"F1", 17:"E2", 18:"D3", 19:"C4", 20:"B5", 21: "A6",
    22:"G1", 23:"F2", 24:"E3", 25:"D4", 26:"C5", 27: "B6", 28: "A7",
    29:"H1", 30:"G2", 31:"F3", 32:"E4", 33:"D5", 34: "C6", 35: "B7", 36: "A8",
    37:"I1", 38:"H2", 39:"G3", 40:"F4", 41:"E5", 42: "D6", 43: "C7", 44: "B8", 45: "A9",
    46:"J1", 47:"I2", 48:"H3", 49:"G4", 50:"F5", 51: "E6", 52: "D7", 53: "C8", 54: "B9", 55: "A10",
    56:"K1", 57:"J2", 58:"I3", 59:"H4", 60:"G5", 61: "F6", 62: "E7", 63: "D8", 64: "C9", 65: "B10", 66: "A11",
             67:"K2", 69:"J3", 70:"I4", 71:"H5", 72: "G6", 73: "F7", 74: "E8", 75: "D9", 76: "C10", 76: "B11",
                      77:"K3", 78:"J4", 79:"I5", 80: "H6", 81: "G7", 82: "F8", 83: "E9", 84: "D10", 85: "C11",
                               86:"K4", 87:"J5", 88: "I6", 89: "H7", 90: "G8", 91: "F9", 92: "E10", 93: "D11", 
                                        94:"K5", 95: "J6", 96: "I7", 97: "H8", 98: "G9", 99: "F10", 100:"E11",
                                                 101:"K6", 102:"J7", 103:"I8", 104:"H9", 105:"G10", 106:"F11",
                                                           107:"K7", 108:"J8", 109:"I9", 110:"H10", 111:"G11",
                                                                     112:"K8", 113:"J9", 114:"I10", 115:"H11",
                                                                               116:"K9", 117:"J10", 118:"I11",
                                                                                         119:"K10", 120:"J11",
                                                                                                    121:"K11"

}