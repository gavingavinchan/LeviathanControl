var GamePad = require('node-gamepad');
var controller = new GamePad('ps4/dualshock4');

controller.connect();

	controller.on("right:move", function(value){
		console.log("controller.on (Right): Running");
		rightX = (value.x - 127)/ 127;
		console.log("RightX: " + rightX);
	});