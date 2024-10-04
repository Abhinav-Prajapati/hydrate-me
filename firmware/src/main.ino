#include <HX711.h>

#define LOADCELL_DOUT_PIN  D1   // Define the pin connected to HX711 DOUT
#define LOADCELL_SCK_PIN   D2   // Define the pin connected to HX711 SCK

HX711 scale;                    // Create an instance of the HX711 class

float calibration_factor = -7050; // Initial calibration factor. Adjust this value based on your sensor.

void setup() {
  Serial.begin(115200);
  delay(10);
  
  // Initialize HX711
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  
  Serial.println("HX711 Calibration");
  Serial.println("Remove all weight from the scale");
  Serial.println("After readings begin, place a known weight on the scale");
  Serial.println("Press 't' to tare, and 'c' to change calibration factor");

  scale.set_scale();  // Set the scale to 1 initially
  scale.tare();       // Reset the scale to zero

  Serial.println("Tare complete. Place known weight.");
}

void loop() {
  // Read a value from the HX711 with the current calibration factor
  float weight = scale.get_units(10); // Average of 10 readings
  Serial.print("Reading: ");
  Serial.print(weight);
  Serial.print(" grams");
  Serial.print(" | Calibration factor: ");
  Serial.println(calibration_factor);
  
  if (Serial.available()) {
    char temp = Serial.read();
    if (temp == 't') {
      scale.tare(); // Reset the scale to zero
      Serial.println("Scale tared.");
    } else if (temp == 'c') {
      Serial.println("Enter new calibration factor:");
      while (!Serial.available()); // Wait for user input
      calibration_factor = Serial.parseFloat(); // Get new calibration factor from serial input
      scale.set_scale(calibration_factor); // Set new calibration factor
      Serial.print("New calibration factor set to: ");
      Serial.println(calibration_factor);
    }
  }

  delay(1000);
}

