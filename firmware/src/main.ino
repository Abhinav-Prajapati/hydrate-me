#include <vector>
#include <ESP8266WiFi.h>  // Include Wi-Fi library
#include <ESP8266mDNS.h>  // Include mDNS library
#include <HX711.h>

// Replace with your network credentials
const char* ssid = "710";
const char* password = "********";

#define LOADCELL_DOUT_PIN  D1   // Define the pin connected to HX711 DOUT
#define LOADCELL_SCK_PIN   D2   // Define the pin connected to HX711 SCK

#define WINDOW_SIZE 10  // Number of raw readings to keep in array

                       
float TOLERANCE = 20.0;  // Acceptable deviation in weight for grouping
float MIN_WATER_LEVEL_DIFFERENCE = 20.0;  // Minimum change in water level to trigger an event
float calibration_factor = -270;  // Calibration factor. Adjust this based on your sensor.
float offset_weight = 84.4;  // Reading of scale without any object placed on it.
float prev_weight = 0.0;  // Last recorded weight.

float raw_reading;  

// Assume when system start the bottle is not placed on it (even it is place on it.. just change its state instationly to true)
bool is_bottle_placed_down = false; 

std::vector<float> water_level_history = {0.0f};  // Initialize with 0.0

// Create an array to store the sliding window of weight readings
float window[WINDOW_SIZE];
int windowIndex = 0;  // Index to track the position for the next reading
int currentSize = 0;  // To track the actual number of readings in the window

// Create an instance of the HX711 module
HX711 scale;

// Utility functions
void printVector(const std::vector<float>& vec);
float find_majority_average();
float add_reading(float new_reading);

void setup() {
  Serial.begin(115200);  // Connect to Wi-Fi
  
  WiFi.begin(ssid, password);
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  // Wait for the connection to succeed
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("Connected to Wi-Fi");
  
  delay(1000); // Small delay before starting mDNS
  // Start the mDNS responder with the hostname "esp8266"
  if (MDNS.begin("esp8266")) {
    Serial.println("mDNS responder started: You can access the ESP via 'http://esp8266.local/'");
  } else {
    Serial.println("Error starting mDNS responder!");
  }

  // Initialize HX711
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  scale.set_scale(calibration_factor);  // Set the scale to calibration factor
  Serial.println("Tare complete. Place known weight.");
}

void loop() {  
  // Required to keep mDNS running
  MDNS.update();
  
  // Read a value from the HX711 with the current calibration factor
  float raw_reading = scale.get_units(1) - offset_weight;  // Subtract the offset weight
  float current_weight = add_reading(raw_reading);  // Add the reading to the sliding window

  //#define _LOG_
  #ifdef _LOG_
    Serial.print(raw_reading);
    Serial.print(" ");
    Serial.print(current_weight);
    Serial.print(" ");
    Serial.print(prev_weight);
    Serial.println(); 
  #endif

  // this part of code only tells if bottle is picked or placed and store its weight in prev_wight variable
  if (current_weight != -1 && abs(prev_weight - current_weight) > MIN_WATER_LEVEL_DIFFERENCE){
    // TODO: Remove this hard coded value (-/+ 15 error) 
    if (abs(current_weight) < 15.0){ // when bottle picked up 
      is_bottle_placed_down = false;
      //Serial.println("Bottle picked : " + String(current_weight));
    } else {
      is_bottle_placed_down = true;
      //Serial.println("Bottle placed  : " + String(current_weight));
    }
    prev_weight = current_weight;
  }

  //#define _LOG_BOTTLE_PLACEMENT_
  #ifdef _LOG_BOTTLE_PLACEMENT_
    if (is_bottle_placed_down){
        Serial.println("Bottle is placed : " + String(prev_weight));
    } else {
        Serial.println("Bottle is picked : " + String(prev_weight));
    }
  #endif
  
  // this part of code append the updated bottle weight to vector
  if ( is_bottle_placed_down ) {
    if (water_level_history.empty()) {
      water_level_history.push_back(prev_weight);
    } else {
      if (water_level_history.back() != prev_weight) {
        water_level_history.push_back(prev_weight);
      }
    }
  }
  //printVector(water_level_history);
  //delay(100);
} 

/**
 * Utility Functions
 */

// Function to find the majority elements that are close to each other and return their average
float find_majority_average() {
    if (currentSize == 0) {
        return -1;  // Return if the window is empty
    }

    float sum = 0;
    int count = 0;

    // Iterate through the array to find close values
    for (int i = 0; i < currentSize; i++) {
        float reference = window[i];
        float tempSum = 0;
        int tempCount = 0;

        for (int j = 0; j < currentSize; j++) {
            if (abs(reference - window[j]) <= TOLERANCE) {
                tempSum += window[j];
                tempCount++;
            }
        }

        // If more than 5 elements are close, consider it the majority group
        if (tempCount > 5) {
            sum = tempSum;
            count = tempCount;
            break;  // Exit once we find the majority
        }
    }

    // If we found enough close values, return the average
    if (count > 5) {
        return sum / count;
    }

    return -1;  // Return -1 if no majority close values found
}

// Function to add a new reading to the sliding window (circular buffer logic)
float add_reading(float new_reading) {
    // Add the new reading to the array at the current index
    window[windowIndex] = new_reading;

    // Move to the next index, wrap around if necessary (circular buffer)
    windowIndex = (windowIndex + 1) % WINDOW_SIZE; // This is clean AF. I dk from where chatgpt pulled this. The is most clean array implemntaion of queue i have ever seen

    // Track the actual number of elements in the window
    if (currentSize < WINDOW_SIZE) {
        currentSize++;
    }

    // Find the average of the majority close values in the window
    float avg = find_majority_average();

    /**
    // Log information about the current average
    if (avg != -1) {
        Serial.print("Current average of majority close values: ");
        Serial.println(avg);
    } else {
        Serial.println("No majority close values found yet.");
    }
    */

    return avg;
}

// Function to print vector elements in a neat way
void printVector(const std::vector<float>& vec) {
    Serial.print("[");
    for (size_t i = 0; i < vec.size(); ++i) {
        Serial.print(vec[i]);

        // Add a comma and space between elements, but not after the last one
        if (i < vec.size() - 1) {
            Serial.print(", ");
        }
    }
    Serial.println("]");
}
