#include <Wire.h>

void setup() {
  // put your setup code here, to run once:
  Wire.begin();
  Serial.begin(9600);  
  delay(100);
  
  Wire.beginTransmission(0x06);
  Wire.write(0xCE);
  Wire.write(0x22);
  Wire.endTransmission();
}

void loop() {
  // put your main code here, to run repeatedly:

}
