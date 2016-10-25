var rpmTimer = (new Date().getTime());

var thruterSignalInterval = 250;
var lastThrusterTimer = 0;

var lastThrusterInputTime;

exports.arduinoMap = function(value,fromLow,fromHigh,toLow,toHigh) {
	var fromRange = fromHigh - fromLow;
	var toRange = toHigh - toLow;

	value = value/fromRange*toRange;
	return Math.floor(value);
};

var updatePower = {};
var currentPower = {};
var thrusterTimer = {};
thrusterTimer.delay = 50;


//TODO: set interval here to update the thruster
exports.startUpdate = function(board){
	var b = board;
	
}

exports.stopUpdate = function(){
	
}

exports.multiThrustInput = function(board,addr,power) {
	updatePower[addr] = power;			//square brackets because addr is a number
	console.log("updatePower =" +  updatePower[addr]);
}

exports.updateThrust = function(board,addrArray) {
	for(var whichAddr = 0; whichAddr<addrArray.length; whichAddr++) {
		var currentAddr = addrArray[whichAddr];
		if((updatePower[currentAddr] != currentPower[currentAddr])) {
			exports.thruster(board,currentAddr,updatePower[currentAddr]);
			currentPower[currentAddr] = updatePower[currentAddr];
		}
	}
}


exports.numberToByte = function(x) {
	var b = x%255;
	var a = (x-b)/255;
	return [a,b];
};

exports.readStatus = function (brd, addr) {
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