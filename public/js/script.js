var c = document.getElementsByClassName("circuit")[0];
let pointse = [new Point(0,0),new Point(20,36)];
let combi = new Combiner(c,700,500);

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
        ctx.lineWidth = 10;
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
        this.y+=point.getY();
    };
}
