var thrusterControl = require('./thrusterControl.js');  // dont know shouild be " or '

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
	
	var t1Addr = 0x29;
	// Send power 0 to init the thruster
	
	var self = board;
	
	setInterval(function() {
 		thrusterControl.readStatus(self, t1Addr);
	}, 2000	);
	
	setInterval(function() {
		thrusterControl.thruster(self,t1Addr,0.9);
	},6000);
	
	setInterval(function() {
		readVolatage(self,0);
	},5000);
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


function ledBlink(board) {
	setTimeout(board.digitalWrite(13,1),500);
	setTimeout(board.digitalWrite(13,0),500);	
}

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




