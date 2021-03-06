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
messWin = new Message("endgame","You won");
messLoss = new Message("endgame","You lost"); 
messCompl = new Message("completed",0);

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
            mess.completed = completed;
            sendActive(wss, websocket, mess);
        }

        if (message.type == "turn" && ws.game!=null && ws.game.active(websocket)) {
            if (ws.player.type == "participant") {
                var x = message.data;

                if (ws.game.allMoves[x+1] != null || ws.game.move != ws.player.type) {
                    let invalid = new Message("Invalid Move", 0);
                    ws.send(JSON.stringify(invalid));



                }
                else {
                    //var curHex = new Hex("participant", x);
                    var curHex = new Hex("participant", x+1);

                    //ws.game.allMoves[x] = curHex;
                    ws.game.allMoves[x+1] = curHex;

                    if (check_victory(x+1, ws, "participant") > 0){
                        console.log("participant wins!");
                        ws.game.participant.send(JSON.stringify(messWin));
                        ws.game.creator.send(JSON.stringify(messLoss));
                        completed++;
                        messCompl.data = completed;
                        sendActive(wss, websocket,messCompl);
                    }

                    let move = new Message("ParticipantMove", x);
                    ws.game.participant.send(JSON.stringify(move));
                    ws.game.creator.send(JSON.stringify(move));
                    ws.game.move = "creator";


                }
            }
            else if (ws.player.type == "creator" && ws.game !=null && ws.game.active(websocket)) {

                var x = message.data;
                if (ws.game.allMoves[x+1] != null || ws.game.move != ws.player.type) {
                    let invalid = new Message("Invalid Move", 0);
                    ws.send(JSON.stringify(invalid));



                }
                else {
                    //var curHex = new Hex("creator", x);
                    var curHex = new Hex("creator", x+1);

                    //ws.game.allMoves[x] = curHex;
                    ws.game.allMoves[x+1] = curHex;

                    if (check_victory(x+1, ws, "creator") > 0){
                        console.log("creator wins!");
                        ws.game.creator.send(JSON.stringify(messWin));
                        ws.game.participant.send(JSON.stringify(messLoss));
                        completed++;
                        messCompl.data = completed;
                        sendActive(wss, websocket,messCompl);
                    }



                    let move = new Message("CreatorMove", x);
                    ws.game.participant.send(JSON.stringify(move));
                    ws.game.creator.send(JSON.stringify(move));
                    ws.game.move = "participant";

                }

            }
        }
        if (message.type == "currgames") {
            let mass = new Message("active", active);
            mass.completed = completed;
            ws.send(JSON.stringify(mass));
            messCompl.data = completed;
            ws.send(JSON.stringify(messCompl));
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
        this.active = function(WebSocket){
            if(this.creator.readyState == WebSocket.OPEN && this.participant !=null && this.participant.readyState == WebSocket.OPEN){
                return true;
            }
            return false;
        }




    }
    server.listen(3001);




    function Hex(player, id) {
        this.state = player;
        this.id = id;

    }

    var ParticipatorEdgeMoves1 = [1,2,4,7,11,16,22,29,37,46,56];
    var ParticipatorEdgeMoves2 = [66,76,85,93,100,106,111,115,118,120,121];
    var CreatorEdgeMoves1 =      [1,3,6,10,15,21,28,36,45,55,66];
    var CreatorEdgeMoves2 =      [56,67,77,86,94,101,107,112,116,119,121];

    function check_victory(id, ws, player) {
        sum_participant = 0;    
        sum_creator = 0;     // victory conditions
        var arr = [id.toString()];        // list of all moves
        var already_checked = [];
        var i = 0;
        var length_before;
        while (true){
            
            var neighbors = findNeighbors(arr[i]); // find neighbors of the hex_id at position i
            i++; // go to next element in queue
            length_before = arr.length; // store number of elements before for stopping condition
            for(var j = 0; j < neighbors.length; j++){ // loop through all neighbors
                if(ws.game.allMoves[neighbors[j]] != null // if the move has been played
                    && ws.game.allMoves[neighbors[j]].state == player
                    && !arr.includes(neighbors[j])){ //if the move has been played by the player in question

                    arr.push(neighbors[j]); //push id to good_neighbors
                }
            }
            

            if(arr.length == length_before
                && arr.length == i){
                
                break; // end loop if no victory
            }

            if(player == "creator"){
                var sum = false;
                var sum2 = false;
                for(var z = 0; z<11; z++){
                    if(arr.includes(CreatorEdgeMoves1[z].toString())){
                        sum = true;
                    }
                    if(arr.includes(CreatorEdgeMoves2[z].toString())){
                        sum2 = true;
                    }
                }
                if(sum && sum2){
                    return true;
                }
            }

            if(player == "participant"){
                var sum = false;
                var sum2 = false;
                for(var z = 0; z < 11; z++){
                    if(arr.includes(ParticipatorEdgeMoves1[z].toString())){
                        sum = true;
                    }
                    if(arr.includes(ParticipatorEdgeMoves2[z].toString())){
                        sum2 = true;
                    }
                }
                if(sum && sum2){
                    return true;
                }
            }




        }
        
        return false;
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
    67:"K2", 68:"J3", 69:"I4", 70:"H5", 71: "G6", 72: "F7", 73: "E8", 74: "D9", 75: "C10", 76: "B11",
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
function prevLetter(letter) {
    if (letter === 'a'){ return 'z'; }
    if (letter === 'A'){ return 'Z'; }
    return String.fromCharCode(letter.charCodeAt(0) - 1);
}

function nextLetter(letter) {
    if (letter === 'z'){ return 'a'; }
    if (letter === 'Z'){ return 'A'; }
    return String.fromCharCode(letter.charCodeAt(0) + 1);
}

function findNeighbors(id){

    var ret = [];
    var original = boardValues[id];
    var letter = original.substr(0,1);

    var number = Number(original.substr(1,2));

    var prevletter = prevLetter(letter);
    var prevletter2 = prevletter;

    var prevletter = prevletter + number;
    var prevletter2 = prevletter2 + (number+1);

    var nextletter = nextLetter(letter);
    var nextletter2 = nextletter;

    var nextletter = nextletter + number;
    var nextletter2 = nextletter2 + (number-1);

    var sameletter = letter;
    var sameletter2 = letter;

    var sameletter = sameletter + (number-1);
    var sameletter2 = sameletter2 + (number+1);

    if(!prevletter.includes("Z")){
        var keyToFind = prevletter;
        for(var i in boardValues){
            if(boardValues[i].includes(keyToFind)){
                var j = i;    
                break; 
            }
        }
        ret.push(j);
    }
    if(!prevletter2.includes("Z") && !prevletter2.includes("12")){
        var keyToFind = prevletter2;
        for(var i in boardValues){
            if(boardValues[i].includes(keyToFind)){
                var j = i;    
                break; 
            }
        }
        ret.push(j);
    }
    if(!nextletter.includes("L")){
        var keyToFind = nextletter;
        for(var i in boardValues){
            if(boardValues[i].includes(keyToFind)){
                var j = i;    
                break; 
            }
        }
        ret.push(j);
    }
    if((!nextletter2.includes("L") && !nextletter2.includes("0")) || (!nextletter2.includes("L") && nextletter2.includes("10"))){
        var keyToFind = nextletter2;
        for(var i in boardValues){
            if(boardValues[i].includes(keyToFind)){
                var j = i;    
                break; 
            }
        }
        ret.push(j);
    }
    if(!sameletter.includes("0") || sameletter.includes("10")){
        var keyToFind = sameletter;
        for(var i in boardValues){
            if(boardValues[i].includes(keyToFind)){
                var j = i;    
                break; 
            }
        }
        ret.push(j);
    }
    if(!sameletter2.includes("12")){
        var keyToFind = sameletter2;
        for(var i in boardValues){
            if(boardValues[i].includes(keyToFind)){
                var j = i;    
                break; 
            }
        }
        ret.push(j);
    }




    return ret;
}

