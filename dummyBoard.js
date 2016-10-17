const EventEmitter = require('events');

var http = require('http'),
    fs = require('fs'),
    // NEVER use a Sync function except at start-up!
    index = fs.readFileSync(__dirname + '/index.html');

// Send index.html to all requests
var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});

// Socket.io server listens to our app
var io = require('socket.io').listen(app);

// Send current time to all connected clients
function sendTime() {
    io.emit('time', { time: new Date().toJSON() });
}

// Send current time every 10 secs
setInterval(sendTime, 10000);

// Emit welcome message on connection
io.on('connection', function(socket) {
    // Use socket to communicate with this particular client only, sending it it's own id
    socket.emit('welcome', { message: 'Welcome!', id: socket.id });

    socket.on('i am client', console.log);
});

app.listen(3000);

var log = function(c){
	console.info("Dummy:\t" + c);
};

var bytesToNumber = function(x) {
	return x[0] * 255 + x[1];
};

exports.createDummyBoard = function(){
	var board = new EventEmitter();
	board.i2cConfig = function(){
		log("i2c Config");
	}
	board.pinMode = function(port, mode){
		log("pinMode set");
	}
	board.digitalWrite = function(port, mode){
		log("digital Write");
	}
	board.i2cWrite = function(addr, command, bytes){
		if(command == 0x00)
			log("Thruster: ", addr, bytesToNumber(bytes));
	}
	setTimeout(function(){
		board.emit("ready");
	}, 1000);
	return board;
};