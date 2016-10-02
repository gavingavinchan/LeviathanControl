var thrusterControl = require('./thrusterControl.js');  // dont know shouild be " or '

var five = require("johnny-five");
var board = new five.Board();

var GamePad = require('node-gamepad');
var controller = new GamePad('ps4/dualshock4'); // dont know if right

var initMultiThrust = false;

controller.connect();

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
	
	var addr = [0x31,0x29];
	
	// Send power 0 to init the thruster
	
	var self = board;
	
	thrusterControl.thruster(self,addr[0],0);
	thrusterControl.thruster(self,addr[1],0);
	
	
	thrusterControl.thruster(self,addr[0],0.5);
	
	setInterval(function() {
		//thrusterControl.thruster(self, addr[0], 1);
 		//thrusterControl.readStatus(self, addr[0]);
	}, 2000	);
	
	
	var rightX;
	
	controller.on("right:move", function(value){
		console.log("controller.on: Running");
		
		rightX = (value.x - 127)/ 127;
		var y = -(value.y -127) / 127;
		
		if(Math.abs(rightX)<0.2) {
			rightX = 0;
		}
		
		if(Math.abs(y)<0.2) {
			y=0;
		}
		
		//var t6Power = (y*0.5)+(x*0.5);
		//var t3Power = (-y*0.5)+(x*0.5);
		
		//console.log("X: " + x);
		//console.log("Y: " + y);
		
		//thrusterControl.thruster(self,addr[0],0)
		
		
		
		thrusterControl.thruster(self,addr[0],rightX);
		
		
	});
	
	/*
	setInterval(function() {
		thrusterControl.runLastInputAfterTime(self,addr[0],rightX,50);
	},20);
	*/
	
	
	
	var leftX;
	
	controller.on("left:move", function(value){
		console.log("controller.on: Running");
		
		leftX = (value.x - 127)/ 127;
		var y = -(value.y -127) / 127;
		
		if(Math.abs(leftX)<0.2) {
			leftX = 0;
		}
		
		if(Math.abs(y)<0.2) {
			y=0;
		}
		
		//var t6Power = (y*0.5)+(x*0.5);
		//var t3Power = (-y*0.5)+(x*0.5);
		
		console.log("LeftX: " + leftX);
		console.log("Y: " + y);
		
		//thrusterControl.thruster(self,addr[1],0)
		
		
		
		thrusterControl.thruster(self,addr[1],leftX);
		
		
	});
	
	/*
	setInterval(function() {
		thrusterControl.runLastInputAfterTime(self,addr[1],leftX,20);
	},20);
	*/
	
	if(initMultiThrust) {
		setInterval(
			thrusterControl.multiThrust(board,)
		)
	}
	
});



/*
function readStatus(brd, addr) {
	brd.i2cReadOnce(addr, 0x02, 9, function(bytes){
		var voltage = (bytes[2] << 8 + bytes[3])/2016;
		console.log("voltage", voltage);
		
		//read temperature
		var tempRaw = (bytes[4] << 8 + bytes[5]);
		var steinhart;
		var temperatureF = function(tempRaw) {
			var thermistornominal = 10000;
			var temperaturenominal = 25;
			var bcoefficent = 3900;
			var seriesresistor = 3300;
			
			var resistance = seriesresistor/(65535/tempRaw-1);
			
			
			steinhart = resistance/thermistornominal;
			steinhart = Math.log(steinhart);
			steinhart /= bcoefficent;
			steinhart += 1/(temperaturenominal + 273.15);
			steinhart = 1.0/steinhart;
			steinhart -= 273.15;
			
			return steinhart;
		};
		temperatureF(tempRaw);
		console.log("temperature" , steinhart);
		
		//read current
		var currentRaw = (bytes[6] << 8) + bytes[7];
		var current = (currentRaw-32767)*0.001122;
		
		console.log("currentRaw", currentRaw);
		console.log("current " + current);
		
		//read pulse count and print rpm
		var pulse = (bytes[0] << 8) + bytes[1];		
		var rpm = pulse/(((new Date().getTime())-rpmTimer)/1000)*60/12;
		rpmTimer = (new Date().getTime());
		
		console.log("pulse" , pulse);
		console.log("rpm" , rpm);
	});
}
*/

/*
function ledBlink(board) {
	setTimeout(board.digitalWrite(13,1),500);
	setTimeout(board.digitalWrite(13,0),500);	
}
*/


/*
function thruster(board,addr,thrust) { // thrust range: -1~1
	var mappedThrust = thrusterControl.arduinoMap(thrust,-1,1,-32767,32767);
	var b = numberToByte(mappedThrust);
	board.i2cWrite(addr, 0x00, [0,0]);
	board.i2cWrite(addr, 0x00, numberToByte(mappedThrust));
	console.log("Thrust: ", mappedThrust, numberToByte(mappedThrust));
}
*/

/*
function numberToByte(x) {
	var b = x%255;
	var a = (x-b)/255;
	return [a,b];
}
*/

/*
function arduinoMap(value,fromLow,fromHigh,toLow,toHigh) {
	var fromRange = fromHigh - fromLow;
	var toRange = toHigh - toLow;
	
	value = value/fromRange*toRange;
  return Math.floor(value);
}
*/

function readVolatage(board,pin) {
	board.analogRead(pin,function(voltage) {
		//console.log((new Date()).getMilliseconds(), voltage*0.04532);
	});
	//console.log("voltmeter: " + voltmeter.read()/1023/5*12);
}




