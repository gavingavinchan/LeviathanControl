var addr = [0x2C,0x2F,0x35,0x2D];
//0 = HL, 1 = HR, 2 = VF, 3 = VR
var direction = [-1,-1,1,1];


var motorAddress = [0x06,0x0A,0x0D];
//0 = Agar extractor motor, 1 = valve turner, 2 = reman lights


var testPower = 0.1;

var lowerThrustLimit = 0.15;
var upperThrustLimit = 0.95;


var thrusterControl = require('./thrusterControl.js');

var motorControl = require('./motorControl.js');

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
  thrusterControl.init(self,addr,60);

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
    var HLThrust = normalizeJoystick(value.x) - normalizeJoystick(value.y);
    var HRThrust = -normalizeJoystick(value.x) - normalizeJoystick(value.y);
    //console.log("joystick HLThurst: " + limitThrust(HLThrust) + "joystick HRThurst: " + limitThrust(HRThrust));
    //console.log("joystick leftY: " + value.y);

    thrusterControl.power(0,limitThrust(HLThrust)*direction[0]);
    thrusterControl.power(1,limitThrust(HRThrust)*direction[1]);
  });

  controller.on("right:move", function(value) {
    var VFThrust = normalizeJoystick(value.x) + normalizeJoystick(value.y);
    var VRThrust = -normalizeJoystick(value.x) + normalizeJoystick(value.y);

		//console.log("joystick VFThurst: " + limitThrust(VFThrust) + "joystick VRThurst: " + limitThrust(VRThrust));
    thrusterControl.power(2,limitThrust(-VFThrust)*direction[2]);
    thrusterControl.power(3,limitThrust(-VRThrust)*direction[3]);
  });


	//l1 and r1
	controller.on("l1:press", function(){
		motorControl.control(self,motorAddress[0],0.004);
		console.log("l1 pressed");
	});

	controller.on("l1:release", function() {
		motorControl.control(self,motorAddress[0],1);
	});

	controller.on("r1:press", function() {
		motorControl.control(self,motorAddress[0],-0.004);
	});

	controller.on("r1:release", function() {
		motorControl.control(self,motorAddress[0],-1);
	})

	//l2 and r2
	controller.on("square:press", function(){
		motorControl.control(self,motorAddress[1],0.004);
		console.log("square pressed");
	});

	controller.on("square:release", function() {
		motorControl.control(self,motorAddress[1],1);
	});

	controller.on("circle:press", function() {
		motorControl.control(self,motorAddress[1],-0.004);
	});

	controller.on("circle:release", function() {
		motorControl.control(self,motorAddress[1],-1);
	})

	//remen lights
	controller.on("x:press", function(){
		motorControl.control(self,motorAddress[2],1);
	});

	controller.on("x:release", function() {
		motorControl.control(self,motorAddress[2],0);
	})
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
