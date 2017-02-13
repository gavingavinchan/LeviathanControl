var addr = [0x35,0x2D,0x29,0x31];
//0 = HL, 1 = HR, 2 = VF, 3 = VR

var testPower = 0.1;

var lowerThrustLimit = 0.1;
var upperThrustLimit = 0.95;


var thrusterControl = require('./thrusterControl.js');

var five = require("johnny-five");
var board = new five.Board();

var GamePad = require("node-gamepad");
var controller = new GamePad("ps4/dualshock4");
controller.connect();

board.on("ready", function() {
	this.pinMode(13, five.Pin.OUTPUT);
	this.pinMode(14, five.Pin.ANALOG);
	this.pinMode(15, five.Pin.ANALOG);

  this.digitalWrite(13, 1);
  // Must called first b4 making any i2c connection
	this.i2cConfig();



  var self = board;

  //initiate thrusterControl
  thrusterControl.init(self,addr,50);

  /*
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
  */

  controller.on("left:move", function(value) {
    var HLThrust = normalizeJoystick(value.x) + normalizeJoystick(value.y);
    var HRThrust = -normalizeJoystick(value.x) + normalizeJoystick(value.y);
    console.log("joystick HLThurst: " + limitThrust(HLThrust) + "joystick HRThurst: " + limitThrust(HRThrust));
    //console.log("joystick leftY: " + value.y);

    thrusterControl.power(0,limitThrust(HLThrust));
    thrusterControl.power(1,limitThrust(HRThrust));
  });

  controller.on("right:move", function(value) {
    var VFThrust = normalizeJoystick(value.x) + normalizeJoystick(value.y);
    var VRThrust = -normalizeJoystick(value.x) + normalizeJoystick(value.y);

		//console.log("joystick VFThurst: " + limitThrust(VFThrust) + "joystick VRThurst: " + limitThrust(VRThrust));
    thrusterControl.power(2,limitThrust(VFThrust));
    thrusterControl.power(3,limitThrust(VRThrust));
  });
});


limitThrust = function(value) {
  if(Math.abs(value) < lowerThrustLimit) {
    value = 0;
  } else if(value > upperThrustLimit) {
    value = upperThrustLimit;
  } else if(value < -upperThrustLimit) {
    value = -upperThrustLimit;
  }
  return value;
}

normalizeJoystick = function(value) {
	return (value-127)/127;
}
