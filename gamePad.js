var GamePad = require("node-gamepad");
var controller = new GamePad("ps4/dualshock4");
controller.connect();

controller.on("right:move", function(value) {

});

mapJoystick = function()
