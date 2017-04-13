var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  this.pinMode(13,five.Pin.OUTPUT);

  setInterval( () => {
    this.digitalWrite(13,1);
  },200);

  setInterval( () => {
    this.digitalWrite(13,0);
  },200);
})
