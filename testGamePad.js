var GamePad = require('node-gamepad');
var controller = new GamePad('ps4/dualshock4');

controller.connect();

	var log = {};
	controller.on("right:move", function(value){
		//console.log("controller.on (Right): Running");
		var rightX = normalizeJoystick(value.x);
		var rightY = normalizeJoystick(value.y);
		log.rightX = rightX;
		log.rightY = rightY;
		//console.log("rightX: " + rightX + " rightY: " + rightY);
	});

	controller.on("left:move", function(value){
		//console.log("controller.on (Right): Running");
		var leftX = normalizeJoystick(value.x);
		var leftY = normalizeJoystick(value.y);
		log.leftX = leftX;
		log.leftY = leftY;
		//console.log("leftX: " + leftX + " leftY: " + leftY);
	});

	setInterval( function() {
		console.log("rightX: " + Math.round(log.rightX *100)/100 + " rightY: " + Math.round(log.rightY * 100)/100 + " leftX: " + Math.round(log.leftX*100)/100 + " leftY: " + Math.round(log.leftY*100)/100);
	},20);

	normalizeJoystick = function(value) {
		return (value-127)/127;
	}
