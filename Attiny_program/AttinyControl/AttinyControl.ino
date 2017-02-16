#include "TinyWireS.h"                  // wrapper class for I2C slave routines
#include <EEPROM.h>

#define motorPin 1
#define cwCcwPin 5

void setup() {
  // put your setup code here, to run once:
  byte I2C_SLAVE_ADDR = 0;
  EEPROM.get(0,I2C_SLAVE_ADDR);
  TinyWireS.begin(I2C_SLAVE_ADDR);      // init I2C Slave mode
  Blink(2); 
  pinMode(cwCcwPin, OUTPUT);
  pinMode(motorPin, OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  if (TinyWireS.available()){           // got I2C input!
    Blink(3);
    byte byteCommand = TinyWireS.receive();     // get the byte from master
    boolean cwCcw = false;            //true = cw, false =ccw
    if(byteCommand == 0x00) {
      byte power = TinyWireS.receive();
      Blink(4);
      if(power<0) {
        cwCcw = false;
      } else {
        cwCcw = true;
      }
      Blink(1);
      digitalWrite(cwCcwPin, cwCcw);
      analogWrite(motorPin,(abs(power)/127)*255);
    }
    
    
    if(byteCommand == 0xCE) {
      byte newAddress = TinyWireS.receive();
      //Write value
      EEPROM.put(0, newAddress);
      Blink(1000);    
      delay(1000);
    } else if(byteCommand == 0x10) {
      Blink(3);
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


