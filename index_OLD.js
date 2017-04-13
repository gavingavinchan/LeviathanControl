var thrusterControl = require('./thrusterControl.js');  // dont know shouild be " or '


var GamePad = require('node-gamepad');
var controller = new GamePad('ps4/dualshock4'); // dont know if right

var initMultiThrust = false;

controller.connect();

var five = require("johnny-five");
var board = new five.Board();

//var rpmTimer = (new Date().getTime());

board.on("ready", function() {
	this.pinMode(13, five.Pin.OUTPUT);
	this.pinMode(14, five.Pin.ANALOG);
	this.pinMode(15, five.Pin.ANALOG);
	//var voltmeter = new five.Pin("A0");

	this.digitalWrite(13, 1);
	// Must called first b4 making any i2c connection
	this.i2cConfig();

	//var t1Addr = 0x31;
	//var t2Addr = 0x29;

	var addr = [0x31,0x2D,0x30,0x29];
	//0 = H1, 1 = H2, 2 = V1, 3 = V2

	var self = board;

	var rightX;

	thrusterControl.startUpdate(self,addr);
	controller.on("right:move", function(value){
		thrusterControl.mapRightJoystick(self,addr,value.x,value.y);
	});


	controller.on("left:move", function(value){
		thrusterControl.mapLeftJoystick(self,addr,value.x,value.y);
	});

	board.analogRead(0, function(value){
		//console.log("voltage: ", Math.round(value/1024*5*0.91 * 100));
	})
});
