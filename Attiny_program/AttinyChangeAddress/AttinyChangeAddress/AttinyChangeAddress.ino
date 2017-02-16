#include <Wire.h>
#define address 0x22
#define newAddress 0x01

void setup() {
  // put your setup code here, to run once:
  Wire.begin();
  Serial.begin(9600);  
  delay(100);
  
  Wire.beginTransmission(address);
  Wire.write(0xCE);             //command to change address
  Wire.write(newAddress);             //new address value
  Wire.endTransmission();
}

void loop() {
  // put your main code here, to run repeatedly:

}
