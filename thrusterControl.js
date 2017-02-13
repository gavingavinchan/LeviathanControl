var board;
var addrArray;

var updateValue = [];

exports.init = function(_board,_addrArr,_updateInterval) {
  board = _board;
  addrArray = _addrArr;

  for(var i=0;i<addrArray;i++) {
    updateValue.push(0);
  }

  setInterval(function() {
    //console.log("arrray.length" + addrArray.length);
    for(var index=0;index<addrArray.length;index++) {
      //console.log("updatePower");
      updatePower(index);
    }
  },_updateInterval);
}

exports.power = function(index,value) {
  updateValue[index] = value;
}

var currentPower = [];
updatePower = function(index) {
  //console.log("updateValue[" + index + "] "  + updateValue[index]);
    var mappedPower = arduinoMap(updateValue[index],-1,1,-32767,32767);
    var bitePower = numberToByte(mappedPower);
    if(index == 0 || index == 1) {
      console.log("addrArray[" + index + "]: " + mappedPower);
    }
    board.i2cWrite(addrArray[index], 0x00, [0,0]);
  	board.i2cWrite(addrArray[index], 0x00, bitePower);
}

numberToByte = function(value) {
	var b = value%255;
	var a = (value-b)/255;
	return [a,b];
};

arduinoMap = function(value,fromLow,fromHigh,toLow,toHigh) {
	var fromRange = fromHigh - fromLow;
	var toRange = toHigh - toLow;

	value = value/fromRange*toRange;
	return Math.floor(value);
};
