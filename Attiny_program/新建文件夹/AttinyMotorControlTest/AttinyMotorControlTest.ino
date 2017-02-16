#include <Wire.h>
#define address 0x22
#define power 127

void setup() {
  // put your setup code here, to run once:
  Wire.begin();
  Serial.begin(9600);  
  delay(100);
  Serial.println("Starting");

  pinMode(13,OUTPUT);
  digitalWrite(13,LOW);
  
  Wire.beginTransmission(address);
  Wire.write(0x00);             //command to turn motor
  Wire.write(power);             //new address value  range: -127~127 -ve = ccw; +ve =cw    
  Serial.println("command sent");
  Blink(2);
  Wire.endTransmission();
}

void loop() {
  // put your main code here, to run repeatedly:

}

void Blink(byte times){ // poor man's display
  for (byte i=0; i< times; i++){
    digitalWrite(13,HIGH);
    delay (250);
    digitalWrite(13,LOW);
    delay (175);
  }
}
