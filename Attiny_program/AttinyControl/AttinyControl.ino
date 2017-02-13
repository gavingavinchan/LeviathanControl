#include "TinyWireS.h"                  // wrapper class for I2C slave routines
#include <EEPROM.h>

void setup() {
  // put your setup code here, to run once:
  byte I2C_SLAVE_ADDR = 0;
  EEPROM.get(0,I2C_SLAVE_ADDR);
  TinyWireS.begin(I2C_SLAVE_ADDR);      // init I2C Slave mode
  Blink(2); 
}

void loop() {
  // put your main code here, to run repeatedly:
  if (TinyWireS.available()){           // got I2C input!
    byte byteCommand = TinyWireS.receive();     // get the byte from master
    if(byteCommand == 0xCE) {
      byte newAddress = TinyWireS.receive();
      //Write value
      EEPROM.put(0, newAddress);
      Blink(1000);    
      delay(1000);
    } else if(byteCommand == 0x10) {
      Blink(15);
    }
  }
}

void Blink(byte times){ // poor man's display
  for (byte i=0; i< times; i++){
    digitalWrite(1,HIGH);
    delay (250);
    digitalWrite(1,LOW);
    delay (175);
  }
}

