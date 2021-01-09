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

app.get("/",function (req,res) {
    res.sendFile("splash.html", {root: "./public",games: active});
});

app.get("/game",function (req,res) {
    res.sendFile("game.html", {root: "./public"});
});

const server = http.createServer(app);
const wss = new websocket.Server({ server });
wss.on("connection", function (ws) {

     ws.on("message", function incoming(message) {
        message = JSON.parse(message);
        if(message.type == "start"){
            console.log(active);
            ws.player = new Player();
            if(queue == null){
                queue = new Game(ws);
            }
            else{
                queue.addPlayer(ws);
                queue = null;
                active++;
            }
            let mess = new Message("active",active);
            sendActive(wss,websocket,mess);
        }
        if(message.type == "currgames"){
            let mass = new Message("active", active);
            ws.send(JSON.stringify(mass));
        }
     });
  
});
function sendActive(wss,WebSocket,data){
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
                      client.send(JSON.stringify(data));
          }
         });
}

function Message(type,data){
    this.type = type;
    this.data = data;
}
function Player(){

}
function Game(ws){
   this.creator = ws;
    this.move = "creator";
    ws.game = this;
    this.addPlayer = function(ws){
        this.participant = ws;
        ws.game = this;
    }
}
server.listen(3001);
