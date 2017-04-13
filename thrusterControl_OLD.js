var rpmTimer = (new Date().getTime());

var lastThrusterInputTime;

exports.arduinoMap = function(value,fromLow,fromHigh,toLow,toHigh) {
	var fromRange = fromHigh - fromLow;
	var toRange = toHigh - toLow;

	value = value/fromRange*toRange;
	return Math.floor(value);
};

exports.thruster = function (board,addr,thrust) { // thrust range: -1~1
	var mappedThrust = exports.arduinoMap(thrust,-1,1,-32767,32767);

	if (mappedThrust>32767) mappedThrust = 32767;
	else if (mappedThrust<-32767) mappedThrust = -32767;

	var b = exports.numberToByte(mappedThrust);
	console.log(addr, mappedThrust);
	board.i2cWrite(addr, 0x00, [0,0]);
	board.i2cWrite(addr, 0x00, b);
};


var updatePower = {};
var currentPower = {};
var thrusterTimer = {};
thrusterTimer.delay = 50;


//TODO: set interval here to update the thruster
exports.startUpdate = function(board,addr) {
	setInterval(function() {
		exports.updateThrust(board,addr);
	},200);
}

exports.stopUpdate = function(){

}

exports.multiThrustInput = function(board,addr,power) {
	updatePower[addr] = power;			//square brackets because addr is a number
}

exports.updateThrust = function(board,addrArray) {
	var log = "";
	for(var whichAddr = 0; whichAddr<addrArray.length; whichAddr++) {
		var currentAddr = addrArray[whichAddr];
		log += updatePower[currentAddr] + "\t";
		if((updatePower[currentAddr] != currentPower[currentAddr])) {
			exports.thruster(board,currentAddr,updatePower[currentAddr]);
			currentPower[currentAddr] = updatePower[currentAddr];
		}
	}
	console.log(log);
}


exports.numberToByte = function(x) {
	var b = x%255;
	var a = (x-b)/255;
	return [a,b];
};

exports.mapLeftJoystick = function(board,addr,x,y) {
	var leftX = x;
	var leftY = y;

	if(Math.abs(leftX)<0.3) {
		leftX = 0;
	}

	if(Math.abs(leftY)<0.2) {
		leftY=0;
	}

	var H1Thrust = leftX + leftY;
	var H2Thrust = -leftX + leftY;
	var limit = 0.5;

	if(H1Thrust > limit) {
		H1Thrust = limit;
	} else if (H1Thrust < -limit){
		H1Thrust = -limit;
	}

	if(H2Thrust > limit) {
		H2Thrust = limit;
	} else if (H2Thrust < -limit){
		H2Thrust = -limit;
	}

	exports.multiThrustInput(board,addr[0],H1Thrust);
	exports.multiThrustInput(board,addr[1],H2Thrust);
}

exports.mapRightJoystick = function(board,addr,x,y) {
	// change the value to nominal value
	var rightX = x;
	var rightY = y;

	if(Math.abs(rightX)<0.2) {
		rightX = 0;
	}

	if(Math.abs(rightY)<0.2) {
		rightY = 0;
	}

	var V1Thrust = rightX - rightY;
	var V2Thrust = rightX + rightY;
	var limit = 0.5;
	if(V1Thrust > limit) {
		V1Thrust = limit;
	} else if (V1Thrust < -limit){
		V1Thrust = -limit;
	}

	if(V2Thrust > limit) {
		V2Thrust = limit;
	} else if (V2Thrust < -limit){
		V2Thrust = -limit;
	}

	//console.log("multiThrustInput");
	exports.multiThrustInput(board,addr[2],V1Thrust);
	exports.multiThrustInput(board,addr[3],V2Thrust);
}



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
