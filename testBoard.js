var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function(){
  this.pinMode(14, five.Pin.ANALOG);
  board.analogRead(0, function(voltage){
    console.log(voltage);
  });
});
