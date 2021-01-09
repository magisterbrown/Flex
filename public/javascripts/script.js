

function redirect(id){
    window.location.replace("/game");
}

var c = document.getElementsByClassName("circuit")[0];
let combi = new Combiner(c,960,650);

combi.addLine([new Point(0,120),new Point(240,120),new Point(280,190)]);
combi.addLine([new Point(0,80),new Point(290,80),new Point(390,250)]);
combi.addLine([new Point(0,30),new Point(360,30)]);
combi.addLine([new Point(0,-15),new Point(280,-15)]);
combi.addLine([new Point(0,-60),new Point(360,-60),new Point(400,-130)]);
combi.addLine([new Point(0,-95),new Point(270,-95),new Point(325,-190),new Point(450,-190)]);
combi.addLine([new Point(0,-130),new Point(210,-130),new Point(260,-220)]);
combi.addLine([new Point(50,-100),new Point(100,-220),new Point(190,-220),new Point(230,-300)]);
combi.addLine([new Point(-100,-100),new Point(-100,-230)]);
combi.addLine([new Point(0,-110),new Point(-210,-110),new Point(-280,-280)]);
combi.addLine([new Point(0,-70),new Point(-250,-70),new Point(-290,-160),new Point(-390,-160)]);
combi.addLine([new Point(0,-35),new Point(-450,-35)]);
combi.addLine([new Point(0,10),new Point(-370,10)]);
combi.addLine([new Point(0,50),new Point(-230,50),new Point(-300,120)]);
combi.addLine([new Point(0,95),new Point(-200,95)]);
combi.addLine([new Point(0,130),new Point(-175,130),new Point(-220,200),new Point(-400,200)]);

function Combiner(c,width,height){
    this.center = new Point(width/2,height/2);
    c.width = width;
    c.height = height;
    this.ctx = c.getContext("2d");
    this.addLine = function(points){
        for(let i=0;i<points.length;i++){
           points[i].center(this.center); 
        }
        let ptx = new Path(points);
        ptx.draw(this.ctx);
    };

}
function Path(points){
   this.end = new Circle(points[points.length-1]);
   this.line = new Line(points); 
   this.draw = function(ctx){
       this.line.draw(ctx);
       this.end.draw(ctx);
   };
}
function Line(points){
    this.points = points;
    this.draw = function(ctx){
        ctx.beginPath();
        ctx.strokeStyle = "#DC3545";
        ctx.lineWidth = 13;
        ctx.moveTo(points[0].getX(),points[0].getY());
        for(let i=1;i<this.points.length;i++){
            ctx.lineTo(this.points[i].getX(),this.points[i].getY());
        }
        ctx.stroke();
        
    };

}
function Circle(point){
    this.x = point.getX();
    this.y = point.getY();
    this.draw = function(ctx){
        this.drawOne(ctx,"#DC3545",22);
        this.drawOne(ctx,"#FFF",12);
    };
    this.drawOne = function(ctx,color,size){
       ctx.beginPath(); 
        ctx.arc(this.x, this.y, size, 0, 2 * Math.PI);
        ctx.lineWidth = 3;
        ctx.fillStyle = color;
        ctx.fill();
    };
}
function Point(xpos,ypos){
    this.x = xpos;
    this.y = ypos;
    this.getX = function(){ return this.x};
    this.getY = function(){ return this.y};
    this.center = function(point){
        this.x+=point.getX();
        this.y=point.getY()-this.y;
    };
}
var games = document.getElementById("games");
const socket = new WebSocket("ws://localhost:3001");
socket.onmessage = function(event){
    let resp = JSON.parse(event.data);
    if(resp.type = "active"){
        games.innerHTML = resp.data;
    }
};        
