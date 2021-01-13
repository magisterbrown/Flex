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
            if (ws.player.type == "participant" && ws.game.whichPlayer == 1) {
                var x = message.data;
                console.log("PARTICIPANT");

                if (ws.game.allMoves[x] != null && ws.game.whichPlayer == 1) {
                    let invalid = new Message("Invalid Move", 0);
                    ws.send(JSON.stringify(invalid));



                }
                else {
                    ws.game.allMoves[x] = x;
                    let move = new Message("ParticipantMove", x);
                    ws.game.participant.send(JSON.stringify(move));
                    ws.game.creator.send(JSON.stringify(move));
                    ws.game.whichPlayer--;


                }
            }
            else if (ws.player.type = "creator" && ws.game.whichPlayer == 0) {

                var x = message.data;
                console.log("CREATOR");
                if (ws.game.allMoves[x] != null) {
                    let invalid = new Message("Invalid Move", 0);
                    ws.send(JSON.stringify(invalid));



                }
                else {
                    ws.game.allMoves[x] = x;
                    let move = new Message("CreatorMove", x);
                    ws.game.participant.send(JSON.stringify(move));
                    ws.game.creator.send(JSON.stringify(move));
                    ws.game.whichPlayer++;


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
    this.whichPlayer = 0;

}
server.listen(3001);




function Hex() {
    this.state;

}