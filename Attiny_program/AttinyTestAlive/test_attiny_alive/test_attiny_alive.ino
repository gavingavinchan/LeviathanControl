#include <Wire.h>

void setup() {
  // put your setup code here, to run once:
  Wire.begin();
  Serial.begin(9600);
  
}

void loop() {
  // put your main code here, to run repeatedly:
  if(Serial.available()) {
    byte x = Serial.read();
    Wire.beginTransmission(0x06);
    Wire.write(0x10);
    Wire.endTransmission();
    Serial.println("0x10 sent to 0x06");
  }
}
