#include <EEPROM.h>
#define newAddress 0x81
#define ledPin 1

void setup() {
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, HIGH); 
  // put your setup code here, to run once:
 EEPROM.put(0, newAddress);
   delay(2000);
   digitalWrite(ledPin, LOW);
   delay(500);
   digitalWrite(ledPin, HIGH);
}

void loop() {
  // put your main code here, to run repeatedly:

}
