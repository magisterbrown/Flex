var express = require("express");
var http = require("http");
const websocket = require("ws");

var port = process.argv[2];
var app = express();

var active = 0;
var completed = 0;
var ids = 0;
var games = new Map();

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
        if(message == "start"){
            ws.player = new Player();
            active++;
            let mess = new Message("active",active);
            sendActive(wss,websocket,mess);
        }
        if(message == "currgames"){
            let mass = new Message("active", active);
            ws.send(JSON.stringify(mass));
        }
     });
     ws.on("close", function incoming() {
         if(ws.player != null){
            active--;
            let mess = new Message("active",active);
            sendActive(wss,websocket,mess);
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
server.listen(3001);
