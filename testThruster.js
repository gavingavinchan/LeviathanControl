var five = require("johnny-five");
var board = new five.Board();

//var rpmTimer = (new Date().getTime());

board.on("ready", function() {
	this.pinMode(13, five.Pin.OUTPUT);
	//var voltmeter = new five.Pin("A0");

	this.digitalWrite(13, 1);
	// Must called first b4 making any i2c connection
	this.i2cConfig();

	var addr = 0x31;

	board.i2cWrite(addr, 0x00, [0,0]);
	board.i2cWrite(addr, 0x00, [100, 100]);

	this.digitalWrite(13, 0);
});
