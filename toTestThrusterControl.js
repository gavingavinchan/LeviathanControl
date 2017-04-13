var addr = [0x35,0x29,0x2D,0x31];
//0 = H1, 1 = H2, 2 = V1, 3 = V2

var testPower = 0.1;


var thrusterControl = require('./thrusterControl.js');

var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
	this.pinMode(13, five.Pin.OUTPUT);
	this.pinMode(14, five.Pin.ANALOG);
	this.pinMode(15, five.Pin.ANALOG);

  this.digitalWrite(13, 1);
  // Must called first b4 making any i2c connection
	this.i2cConfig();



  var self = board;

  thrusterControl.init(self,addr,200);
	for(var index=0;index<addr.length;index++) {
		thrusterControl.power(index,testPower);
	}

	setTimeout(function() {
		for(var index=0;index<addr.length;index++) {
			thrusterControl.power(index,0);
		}
  },2000);


	setTimeout(function() {
		for(var index=0;index<addr.length;index++) {
			thrusterControl.power(index,-testPower);
		}
	},4000);
});
