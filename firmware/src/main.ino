#include <WiFi.h>
#include <HX711.h>
#include <ESPmDNS.h>
#include <FastLED.h>
#include <WiFiClient.h>
#include <freertos/task.h>
#include <freertos/queue.h>
#include <freertos/semphr.h>
#include <AsyncMqttClient.h>

#include "config.h"
#include "mqtt_config.h"
#include "status_LED.h"

QueueHandle_t bottleWeightChangeDataQueue; // Queue handle
SemaphoreHandle_t xMutex;                  // Mutex handler to handle animation_mode updations

#define LOADCELL_DOUT_PIN 16 // Define the pin connected to HX711 DOUT (GPIO 16)
#define LOADCELL_SCK_PIN 17  // Define the pin connected to HX711 SCK (GPIO 17)

#define WINDOW_SIZE 10 // Number of raw readings to keep in array

float TOLERANCE = 20.0;                  // Acceptable deviation in weight for grouping
float MIN_WATER_LEVEL_DIFFERENCE = 20.0; // Minimum change in water level to trigger an event
float calibration_factor = -270;         // Calibration factor. Adjust this based on your sensor.
float offset_weight = 100.4;              // Reading of scale without any object placed on it.

float raw_reading;

// Create an array to store the sliding window of weight readings
float window[WINDOW_SIZE];
int windowIndex = 0; // Index to track the position for the next reading
int currentSize = 0; // To track the actual number of readings in the window

// Create an instance of the HX711 module
HX711 scale;

// Create an instance of asyncmqttclient module
AsyncMqttClient mqttClient;

// Utility functions
void printVector(const std::vector<float> &vec);
float find_majority_average();
float add_reading(float new_reading);

/**
 * animation_mode varialbe can be set to any of below mentioned
 * values.
 * These variables are intended to set by different tasks via semaphors
 * NOTE: Use mutex to safely reading and updating this variable
 * Animation mode
 * 0 - Off
 * 1 - Spinner (booting)
 * 2 - error
 * 3 - breathing green
 * 4 - breathing blue
 * 5 - breathing red
 * */
int animation_mode = 1;

void setup()
{
  /** Start serial communication **/
  Serial.begin(115200);

  /************************88** Setup RBG WS128B light *****************************/
  FastLED.addLeds<WS2812B, LED_PIN, GRB>(leds, NUM_LEDS);
  FastLED.setBrightness(BRIGHTNESS);
  fill_solid(leds, NUM_LEDS, CRGB::Black);
  FastLED.show();
  /*********************************************************************************/

  xMutex = xSemaphoreCreateMutex();
  if (xMutex == NULL)
  {
    Serial.println("Unable to create mutex");
    while (1)
      ;
  }

  // Initialize the queue (size: 10 floats)
  bottleWeightChangeDataQueue = xQueueCreate(10, sizeof(float));
  if (bottleWeightChangeDataQueue == NULL)
  {
    Serial.println("Failed to create the queue");
    while (1)
      ; // Stay here if queue creation fails
  }

  // Create the FreeRTOS task for the LED ring light animation
  xTaskCreate(
      ledTask,
      "LED Task",
      4096,
      NULL,
      1,
      NULL);

  /****************************** Connect to Wi-Fi *********************************/
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to ");
  Serial.println(WIFI_SSID);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("Connected to Wi-Fi");
  animation_mode = 0; // Turn of light once esp is connected to wifi
  /*********************************************************************************/

  /***************************** Configure MQTT Client *****************************/
  mqttClient.onConnect(onMqttConnect);
  mqttClient.onMessage(onMqttMessage);
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  mqttClient.connect();
  /*********************************************************************************/

  /******************************* Initialize HX711 ********************************/
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  scale.set_scale(calibration_factor); // Set the scale to calibration factor
  Serial.println("Tare complete. Place known weight.");
  /*********************************************************************************/

  // Create the weightTask FreeRTOS task
  xTaskCreate(
      weightTask,    // Task function
      "Weight Task", // Name of the task (for debugging)
      8192,          // Stack size (in bytes)
      NULL,          // Parameter to pass to the task (if any)
      1,             // Task priority (1 is a normal priority)
      NULL           // Task handle (not needed in this case)
  );

  // Create the MQTT task to publish data from the queue
  xTaskCreate(
      mqttTask,    // Task function
      "MQTT Task", // Name of the task (for debugging)
      4096,        // Stack size (in bytes)
      NULL,        // Parameter to pass to the task (if any)
      1,           // Task priority (1 is normal priority)
      NULL         // Task handle (not needed in this case)
  );
}

void loop() {}

/**
 * Utility Functions
 */

// Function to find the majority elements that are close to each other and return their average
float find_majority_average()
{
  if (currentSize == 0)
  {
    return -1; // Return if the window is empty
  }

  float sum = 0;
  int count = 0;

  // Iterate through the array to find close values
  for (int i = 0; i < currentSize; i++)
  {
    float reference = window[i];
    float tempSum = 0;
    int tempCount = 0;

    for (int j = 0; j < currentSize; j++)
    {
      if (abs(reference - window[j]) <= TOLERANCE)
      {
        tempSum += window[j];
        tempCount++;
      }
    }

    // If more than 5 elements are close, consider it the majority group
    if (tempCount > 5)
    {
      sum = tempSum;
      count = tempCount;
      break; // Exit once we find the majority
    }
  }

  // If we found enough close values, return the average
  if (count > 5)
  {
    return sum / count;
  }

  return -1; // Return -1 if no majority close values found
}

// Function to add a new reading to the sliding window (circular buffer logic)
float add_reading(float new_reading)
{
  // Add the new reading to the array at the current index
  window[windowIndex] = new_reading;

  // Move to the next index, wrap around if necessary (circular buffer)
  windowIndex = (windowIndex + 1) % WINDOW_SIZE;

  // Track the actual number of elements in the window
  if (currentSize < WINDOW_SIZE)
  {
    currentSize++;
  }

  // Find the average of the majority close values in the window
  float avg = find_majority_average();
  return avg;
}

void weightTask(void *pvParameters)
{

  float last_weight = 0.0; // Last recorded weight.
  float prev_queue_data = 0.0;
  // Assume when system start the bottle is not placed on it (even it is placed on it.. just change its state instantly to true)
  bool is_bottle_placed_down = false;

  while (1)
  {
    // Read a value from the HX711 with the current calibration factor
    float raw_reading = scale.get_units(1) - offset_weight; // Subtract the offset weight
    float current_weight = add_reading(raw_reading);        // Add the reading to the sliding window
    // Serial.println("Current sensor reading " + String(raw_reading));

    // Check if bottle is picked or placed
    if (current_weight != -1 && abs(last_weight - current_weight) > MIN_WATER_LEVEL_DIFFERENCE)
    {
      if (abs(current_weight) < 30.0)
      { // When bottle picked up
        // Lock the mutex before writing to the shared variable
        if (xSemaphoreTake(xMutex, portMAX_DELAY) == pdTRUE)
        {
          // TODO: make api call to server so it knows that bottle has been pikced
          Serial.println("bottle has been picked");
          
          String payload = DEVICE_ID + String("|") + String("is_picked_up") + String("|") + String("1");

          // Publish the data to the MQTT topic
          mqttClient.publish(TOPIC_WEIGHT_CHANGE, 1, false, payload.c_str());

          Serial.print("Published to MQTT: ");
          Serial.println(payload);
          
          animation_mode = 3;     // if bottle is picked up set animation to breating green
          xSemaphoreGive(xMutex); // Release the mutex
        }
        is_bottle_placed_down = false;
      }
      else
      {
        // Lock the mutex before writing to the shared variable
        if (xSemaphoreTake(xMutex, portMAX_DELAY) == pdTRUE)
        {
          // TODO: make api call to server so it knows that bottle has been placed back
          Serial.println("bottle has been placed back");
          
          String payload = DEVICE_ID + String("|") + String("is_picked_up") + String("|") + String("0");

          // Publish the data to the MQTT topic
          mqttClient.publish(TOPIC_WEIGHT_CHANGE, 1, false, payload.c_str());

          Serial.print("Published to MQTT: ");
          Serial.println(payload);
          
          animation_mode = 0;     // if bottle is placed down turn off animation
          xSemaphoreGive(xMutex); // Release the mutex
        }
        is_bottle_placed_down = true;
      }
      last_weight = current_weight; // Update last recorded weight
    }

    if (is_bottle_placed_down && prev_queue_data != last_weight)
    {
      // Send the sensor data to the queue
      if (xQueueSend(bottleWeightChangeDataQueue, &last_weight, portMAX_DELAY) != pdPASS)
      {
        Serial.println("Failed to send weight change data to the queue");
      }
      prev_queue_data = last_weight; // Update prev_queue_data
      Serial.println("new data " + String(last_weight));
    }
    // Add a small delay to control the sampling rate of the weight sensor
    vTaskDelay(30 / portTICK_PERIOD_MS); // 30ms delay between each weight read
  }
}

void ledTask(void *pvParameters)
{
  int mode;
  // Lock the mutex before reading the shared variable
  int stepSize = 200; // Time step in ms

  while (1)
  {
    if (xSemaphoreTake(xMutex, portMAX_DELAY) == pdTRUE)
    {
      mode = animation_mode;
      xSemaphoreGive(xMutex); // Release the mutex
    }
    switch (mode)
    {
    case 0: // MUTE animation
      fill(MUTE);
      FastLED.show();
      break;

    case 1:                                        // Booting spinner animation
      spinner(BOOTING_BG, BOOTING_FG, counter, 4); // 4 pixel width
      break;

    case 2: // Error pulse animation
      pulse(ERR_MIN, ERR_MAX, ratio, up);
      break;

    case 3:             // Breathing effect animation (Green)
      breathingGreen(); // Use green color for breathing effect
      break;

    case 4:            // Breathing effect animation (Blue)
      breathingBlue(); // Use blue color for breathing effect
      break;

    case 5:                 // Breathing effect animation (Reddish-Orange)
      breathingRedOrange(); // Use reddish-orange color for breathing effect
      break;

    default: // Blank or default animation
      fill(CRGB::Black);
      FastLED.show();
      break;
    }

    // Animation update logic for spinner and pulse effects
    if (mode < 3)
    { // Breathing effect has its own timing, so skip this part for modes 3, 4, 5
      counter = ++counter % NUM_LEDS;
      ratio = min(1.0, (double)(counter * stepSize + (millis() - stepSize)) / 1000);
      if (counter == 0)
      {
        up = !up; // Swap direction
      }
    }

    // Task delay for smooth animation updates (except breathing which has its own delay)
    if (mode < 3)
    {
      vTaskDelay(80 / portTICK_PERIOD_MS); // 40ms delay for other effects
    }
  }
}

void onMqttConnect(bool sessionPresent)
{
  String topic = String("/") + DEVICE_ID + TOPIC_LED_MODE;
  Serial.println("Connected to MQTT. " + topic);
  mqttClient.subscribe(topic.c_str(), 1);
}

void onMqttSubscribe(uint16_t packetId, uint8_t qos)
{
  Serial.println("Subscribed to topic.");
}

void onMqttMessage(char *topic, char *payload, AsyncMqttClientMessageProperties properties, size_t len, size_t index, size_t total)
{
  Serial.print("Received message on topic: ");

  // Convert the payload to a string
  String messagePayload;
  for (size_t i = 0; i < len; i++)
  {
    messagePayload += (char)payload[i];
  }

  // Convert the payload string to an integer
  int led_mode = messagePayload.toInt(); // Convert to integer

  // Log the received LED mode
  Serial.print("Received LED mode: ");
  Serial.println(led_mode);

  // Acuire the mutex and write the led mode which is recived from mqtt
  if (xSemaphoreTake(xMutex, portMAX_DELAY) == pdTRUE)
  {
    animation_mode = led_mode;
    xSemaphoreGive(xMutex); // Release the mutex
  }

  // Handle the LED mode accordingly
  // You can now use `led_mode` as an integer
}

// Function to handle publishing data to MQTT topic from the queue
void mqttTask(void *pvParameters)
{
  float weightData; // Variable to store data from the queue

  while (1)
  {
    // Check if data is available in the queue
    if (xQueueReceive(bottleWeightChangeDataQueue, &weightData, portMAX_DELAY) == pdPASS)
    {
      // Data successfully received from the queue
      Serial.print("Data received from queue: ");
      Serial.println(weightData);

      /*
        inclue device id along with current bottle weight
        "esp32-n2vf7inz|weight|30.34"
      */
      String payload = DEVICE_ID + String("|") + String("weight") + String("|") + String(weightData);

      // Publish the data to the MQTT topic
      mqttClient.publish(TOPIC_WEIGHT_CHANGE, 1, false, payload.c_str());

      Serial.print("Published to MQTT: ");
      Serial.println(payload);
    }

    // Add a small delay for stability (optional)
    vTaskDelay(10 / portTICK_PERIOD_MS); // 10ms delay
  }
}
