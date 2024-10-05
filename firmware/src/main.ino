#include <WiFi.h>      // ESP32 Wi-Fi library
#include <vector>
#include <ESPmDNS.h>   // ESP32 mDNS library
#include <HX711.h>
#include "config.h"
#include <FastLED.h>

#define LOADCELL_DOUT_PIN  16   // Define the pin connected to HX711 DOUT (GPIO 16)
#define LOADCELL_SCK_PIN   17   // Define the pin connected to HX711 SCK (GPIO 17)

#define WINDOW_SIZE 10  // Number of raw readings to keep in array

#define LED_PIN    18         // Pin connected to the WS2812B data line (GPIO 18)
#define NUM_LEDS   17         // Number of LEDs in the strip or ring
#define BRIGHTNESS 128        // Brightness level (0-255)
#define LED_TYPE   WS2812B    // LED type
#define COLOR_ORDER GRB       // Color order for WS2812B (Green, Red, Blue)

// Create a FastLED array to hold the LED data
CRGB leds[NUM_LEDS];

float TOLERANCE = 20.0;  // Acceptable deviation in weight for grouping
float MIN_WATER_LEVEL_DIFFERENCE = 20.0;  // Minimum change in water level to trigger an event
float calibration_factor = -270;  // Calibration factor. Adjust this based on your sensor.
float offset_weight = 84.4;  // Reading of scale without any object placed on it.
float prev_weight = 0.0;  // Last recorded weight.

float raw_reading;  

// Assume when system start the bottle is not placed on it (even it is placed on it.. just change its state instantly to true)
bool is_bottle_placed_down = false; 

std::vector<float> water_level_history;  // Initialize with 0.0

// Create an array to store the sliding window of weight readings
float window[WINDOW_SIZE];
int windowIndex = 0;  // Index to track the position for the next reading
int currentSize = 0;  // To track the actual number of readings in the window

// Create an instance of the HX711 module 
HX711 scale;

// FreeRTOS task for the LED ring light animation
void ledTask(void *pvParameters);

// Utility functions
void printVector(const std::vector<float>& vec);
float find_majority_average();
float add_reading(float new_reading);

void setup() {
  
  FastLED.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS);
  FastLED.setBrightness(BRIGHTNESS);
  // Clear all LEDs before setting the next one
  fill_solid(leds, NUM_LEDS, CRGB::Black);
  FastLED.show();
  
  // Create the FreeRTOS task for the LED ring light animation
  xTaskCreate(ledTask, "LED Task", 2048, NULL, 1, NULL);

  // Create the FreeRTOS task for weight monitoring
  xTaskCreate(weightTask, "Weight Task", 2048, NULL, 1, NULL);
  
  Serial.begin(115200);  // Start serial communication
  
  // Connect to Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to ");
  Serial.println(WIFI_SSID);
  
  // Wait for the connection to succeed
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.println("Connected to Wi-Fi");
  
  // Start the mDNS responder with the hostname "esp32"
  if (MDNS.begin("esp32")) {
    Serial.println("mDNS responder started: You can access the ESP32 via 'http://esp32.local/'");
  } else {
    Serial.println("Error starting mDNS responder!");
  }

  // Initialize HX711
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  scale.set_scale(calibration_factor);  // Set the scale to calibration factor
  Serial.println("Tare complete. Place known weight.");
}

void loop() {  
  
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
    windowIndex = (windowIndex + 1) % WINDOW_SIZE;

    // Track the actual number of elements in the window
    if (currentSize < WINDOW_SIZE) {
        currentSize++;
    }

    // Find the average of the majority close values in the window
    float avg = find_majority_average();
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

// FreeRTOS task for controlling the LED ring light animation
void ledTask(void *pvParameters) {
  static uint8_t ledIndex = 0;  // Keep track of the current LED
  static int8_t direction = 1;  // Control the direction of the animation (1 = forward, -1 = backward)

  while (1) {  // Infinite loop for the FreeRTOS task
    // Clear all LEDs before setting the next one
    fill_solid(leds, NUM_LEDS, CRGB::Black);

    // Set the current LED to purple
    leds[ledIndex] = CRGB::Purple;

    // Update the LED strip
    FastLED.show();

    ledIndex += direction;   // Move back into the valid range
    ledIndex = ledIndex % NUM_LEDS;

    // Add a small delay (in FreeRTOS terms, this is non-blocking)
    vTaskDelay(200 / portTICK_PERIOD_MS);  // 200ms delay between each update
  }
}

// FreeRTOS task to monitor weight using HX711
void weightTask(void *pvParameters) {
    while (1) {
        // Read a value from the HX711 with the current calibration factor
        float raw_reading = scale.get_units(1) - offset_weight;  // Subtract the offset weight
        float current_weight = add_reading(raw_reading);  // Add the reading to the sliding window

        // Check if bottle is picked or placed
        if (current_weight != -1 && abs(prev_weight - current_weight) > MIN_WATER_LEVEL_DIFFERENCE) {
            if (abs(current_weight) < 15.0) { // When bottle picked up 
                is_bottle_placed_down = false;
            } else {
                is_bottle_placed_down = true;
            }
            prev_weight = current_weight;
        }

        // Append the updated bottle weight to the vector
        if (is_bottle_placed_down) {
            if (water_level_history.empty() || water_level_history.back() != prev_weight) {
                water_level_history.push_back(prev_weight);
            }
        }

        // Print the updated water level history
        printVector(water_level_history);

        // Add a small delay to control the sampling rate of the weight sensor
        vTaskDelay(30 / portTICK_PERIOD_MS);  // 500ms delay between each weight read
    }
}

