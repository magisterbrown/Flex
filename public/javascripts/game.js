
function change_color(id) {
    var x = id;
    alert(x);
    if (x%3 == 0){
        document.getElementById(x).style.backgroundColor = "white";
        x--;
        document.getElementById(x).style.backgroundColor = "white";
        x--;
        document.getElementById(x).style.backgroundColor = "white";
        
    }
    if (x%3 == 1){
        document.getElementById(x).style.backgroundColor = "white";
        x++;
        document.getElementById(x).style.backgroundColor = "white";
        x++;
        document.getElementById(x).style.backgroundColor = "white";
        
    }

    if (x%3 == 2){
        document.getElementById(x).style.backgroundColor = "white";
        x++;
        document.getElementById(x).style.backgroundColor = "white";
        x--;
        x--;
        document.getElementById(x).style.backgroundColor = "white";
    }
    
}


var i;
var hexagon = document.createElement("hex4").className("hex4");
document.body.append(hexagon);