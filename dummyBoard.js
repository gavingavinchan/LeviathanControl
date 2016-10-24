const EventEmitter = require('events');
var io = require('socket.io-client')('http://localhost:3000');

var log = function(c){
	io.emit(c);
};

var bytesToNumber = function(x) {
	return x[0] * 255 + x[1];
};

exports.createDummyBoard = function(){
	var board = new EventEmitter();
	board.i2cConfig = function(){
		log("i2cConfig");
	}
	board.pinMode = function(port, mode){
		log("pinMode");
	}
	board.digitalWrite = function(port, mode){
		log("digitalWrite");
	}
	board.i2cWrite = function(addr, command, bytes){
		if(command == 0x00)
			log("Thruster", {addr: addr, power: bytesToNumber(bytes)});
	}
	setTimeout(function(){
		log("boardReady");
		board.emit("ready");
	}, 1000);
	return board;
};