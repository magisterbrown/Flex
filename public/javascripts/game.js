function Message(type,data){
    this.type = type;
    this.data = data;
}
const socket = new WebSocket("ws://localhost:3001");
socket.onopen = function(e) {
      socket.send(JSON.stringify(new Message("start",0)));
};
socket.onclose = function(event){
    alert("enemy left game");
    window.location.replace("/");
};
socket.onmessage = function(event){
    let resp = JSON.parse(event.data);
    if(resp.type == "stop"){
        alert("enemy left game");
    }
};        
function change_color(id) {
    var x = id;

    

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
var endNodes = [1,3,6,10,15,21,28,36,45,55,66,76,85,93,100,106,111,115,118,120,121]
var grid = document.createElement("div");
grid.className = "grid";



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


var i;
var j = 1;
for(i = 0; i < 121; i++){

    
    var bigHex = document.createElement('div');
    bigHex.className = "hex4";
    bigHex.id = boardValues[i+1];
    
        var h1 = document.createElement('div');
        h1.className = "h1";
        h1.id = j;
        h1.onclick = function(){change_color(this.id)};
        
    
        var h2 = document.createElement('div');
        j++;
        h2.className = "h2";
        h2.id = j;
        h2.onclick = function(){change_color(this.id)};

      
        

        var h3 = document.createElement('div');
        j++;
        h3.className = "h3";
        h3.id = j;
        h3.onclick = function(){change_color(this.id)};
        j++;

    bigHex.appendChild(h1);
    bigHex.appendChild(h2);
    bigHex.appendChild(h3);

    grid.appendChild(bigHex);

    if (endNodes.includes(i+1)){
        var newLine = document.createElement('div');
        newLine.className = "newline";
        grid.appendChild(newLine);
    }
}



document.body.appendChild(grid);


function give_number(id) {
    
}


