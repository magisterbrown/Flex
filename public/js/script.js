var c = document.getElementsByClassName("circuit")[0];
c.width=700;
c.height=500;
var ctx = c.getContext("2d");
ctx.beginPath();
ctx.moveTo(20, 20);
ctx.lineTo(20, 100);
ctx.lineTo(70, 100);
ctx.stroke();
let pointse = [new Point(0,0),new Point(200,360)];
let poitne = new Point(10,10);
function Path(points){
   this.end = new Circle(points[points.length-1]);
   this.line = new Line(points); 
   this.draw = function(center,ctx){
       this.line.draw(center,ctx);
       this.end.draw(center,ctx);
   };
}
function Line(points){
    this.points = points;
    this.draw = function(center,ctx){
        ctx.beginPath();
        ctx.strokeStyle = "#DC3545";
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
    this.draw = function(center,ctx){
       ctx.beginPath(); 
        ctx.arc(this.x, this.y, 22, 0, 2 * Math.PI);
        ctx.lineWidth = 3;
        ctx.fillStyle = '#DC3545';
        ctx.fill();
        
        ctx.beginPath(); 
        ctx.arc(this.x, this.y, 12, 0, 2 * Math.PI);
        ctx.lineWidth = 3;
        ctx.fillStyle = '#FFF';
        ctx.fill();
    };
}
function Point(xpos,ypos){
    this.x = xpos;
    this.y = ypos;
    this.getX = function(){ return this.x};
    this.getY = function(){ return this.y};
}
