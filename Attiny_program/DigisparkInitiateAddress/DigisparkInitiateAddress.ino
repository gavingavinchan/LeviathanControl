#include <EEPROM.h>
#define newAddress 0x79

void setup() {
  // put your setup code here, to run once:
 EEPROM.put(0, newAddress);
}

void loop() {
  // put your main code here, to run repeatedly:

}
