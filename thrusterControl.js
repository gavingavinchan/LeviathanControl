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

exports.thruster = function (board,addr,thrust) { // thrust range: -1~1
	var signalDelay = 0;
	
	console.log("thrust: " + thrust);
	
	//lastThrusterTimer = new Date().getTime();
	signalDelay = lastThrusterTimer + thruterSignalInterval;
	
	/*
	console.log("<before>");
	console.log("Date: " + new Date().getTime());
	console.log("lastThrusterTimer: " + lastThrusterTimer);
	console.log("lastThrusterTimer + thruterSignalInterval: " + signalDelay);
	console.log("</before Loop>");
	
	console.log("thrust: " + thrust);
	*/
	
	if(new Date().getTime() > signalDelay) {
		//console.log("in loop");
		var mappedThrust = exports.arduinoMap(thrust,-1,1,-32767,32767);
		
		if (mappedThrust>15000) mappedThrust = 15000;
		else if (mappedThrust<-15000) mappedThrust = -15000;
		
		var b = exports.numberToByte(mappedThrust);
		board.i2cWrite(addr, 0x00, [0,0]);
		board.i2cWrite(addr, 0x00, b);
		
		//console.log("Before lastThrusterTimer: " + lastThrusterTimer);
		
		// console.log("Thrust: ", mappedThrust, b);
		lastThrusterTimer = new Date().getTime();
		
		lastThrusterInputTime = new Date().getTime();
		
		//console.log("After lastThrusterTimer: " + lastThrusterTimer);
	}
};


exports.runLastInputAfterTime = function(board,addr,Input,t) {
	//console.log("Running runLastInputAfterTime");
	if(new Date().getTime() > lastThrusterInputTime + t) {
		exports.thruster(board,addr,Input);
		console.log("Input: " + Input);
		console.log("runLastInputAfterTime new date: " + new Date().getTime());
	}
}


var updatePower = {};
var currentPower = {};
var thrusterTimer = {};
thrusterTimer.delay = 50;

exports.multiThrustInput = function(board,addr,power) {
	updatePower[addr] = power;			//square brackets because addr is a number
	console.log("updatePower =" +  updatePower[addr]);
}


exports.UpdateThrust = function(board,addrArray) {
	console.log("UpdateThrust: Running");
	for(var whichAddr = 0; whichAddr<addrArray.length; whichAddr++) {
		var currentAddr = addrArray[whichAddr];
		if((updatePower[currentAddr] !== currentPower[currentAddr]) || new Date().getTime() > thrusterTimer.currentAddr + thrusterTimer.delay) {
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