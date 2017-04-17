var board;

exports.control = function(_board,_address,_power) {
  //console.log("rotationPower");
  board = _board;
  var rotation = 0;
  if(_power > 0) {
    rotation = 1;
  } else {
    rotation = 0;
  }

  board.i2cWrite(_address,0x00);
  board.i2cWrite(_address,rotation);
  console.log("rotation i2c write" + rotation);
  board.i2cWrite(_address,Math.abs(_power*255));
  console.log("write power: " + Math.abs(_power*255));
};
