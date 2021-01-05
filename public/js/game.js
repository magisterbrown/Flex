
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
var hexes = document.getElementsByClassName("h1");
hexes[0].onclick = function() {
    alert(5445);
};
for(var i = 0;i < hexes.length;i++){
    hexes[i].onclick = function() {
        alert(5445);
    };
}