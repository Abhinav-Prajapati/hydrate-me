#ifndef STATUS_LED_H
#define STATUS_LED_H

#include <FastLED.h>
#include <math.h>  // To use the sin() function for smooth transitions

// Pin and LED settings
#define LED_PIN 18  // Pin connected to the WS2812B data line (GPIO 18)
#define NUM_LEDS 17 // Number of LEDs in the strip or ring
#define BRIGHTNESS 128

int counter = 0;  // step function (spinner)
double ratio = 0; // continuous (pulse)
bool up = true;   // direction (pulse)

CRGB leds[NUM_LEDS]; // Declare the LED array globally

// LED color definitions
const CRGB BOOTING_BG = CRGB(0, 0, 255);   // Blue
const CRGB BOOTING_FG = CRGB(0, 255, 255); // Cyan
const CRGB MUTE = CRGB(153, 0, 0);         // Dark red
const CRGB ERR_MIN = CRGB(17, 17, 0);      // Dim yellow
const CRGB ERR_MAX = CRGB(255, 17, 0);     // Bright red

const CRGB BREATHING_COLOR_GREEN = CRGB(0, 255, 0);       // Green for breathing
const CRGB BREATHING_COLOR_BLUE = CRGB(0, 0, 255);        // Blue for breathing
const CRGB BREATHING_COLOR_RED_ORANGE = CRGB(255, 30, 0); // Reddish-orange for breathing

// Utility Functions for Animations

// Fill all LEDs with the specified color
void fill(CRGB color) {
  for (int i = 0; i < NUM_LEDS; i++) {
    leds[i] = color;
  }
}

// Function to smoothly transition between two colors (pulse effect)
void pulse(CRGB color_min, CRGB color_max, double ratio, bool up) {
  double t = (up) ? ratio : 1 - ratio;
  CRGB color = blend(color_min, color_max, t * 255);
  fill(color);
  FastLED.show();
}

// Spinner effect function
void spinner(CRGB bg_color, CRGB fg_color, int pos, int width) {
  fill(bg_color);
  for (int i = pos; i < pos + width; i++) {
    leds[i % NUM_LEDS] = fg_color;
  }
  FastLED.show();
}

// Breathing effect for any color
void breathingEffect(CRGB color) {
  static uint8_t brightness = 10;
  static uint16_t breathingStep = 2;  // Breathing step for controlling sine wave

  // Use a sine wave to control brightness for smooth breathing effect
  float phase = (sin(breathingStep * 0.02) + 1.0) / 2.0; // Map sine wave to range 0 to 1
  brightness = phase * BRIGHTNESS;  // Scale brightness based on sine wave

  FastLED.setBrightness(brightness+5); // add 5 to brightness so it never turn off creating a very suttle animation
  fill(color);
  FastLED.show();

  // Increment the breathing step
  breathingStep += 1;

  // Delay for smoother breathing effect
  vTaskDelay(6 / portTICK_PERIOD_MS);  // Adjust for faster/slower breathing
}

// Breathing effect for Green
void breathingGreen() {
  breathingEffect(BREATHING_COLOR_GREEN);
}

// Breathing effect for Blue
void breathingBlue() {
  breathingEffect(BREATHING_COLOR_BLUE);
}

// Breathing effect for Reddish-Orange
void breathingRedOrange() {
  breathingEffect(BREATHING_COLOR_RED_ORANGE);
}

// FreeRTOS task for controlling the LED ring light animation
void ledTask(void *pvParameters) {
  int mode = *(int *)pvParameters; // Mode passed as parameter
  int stepSize = 200;              // Time step in ms

  while (1) {
    switch (mode) {
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

    case 3: // Breathing effect animation (Green)
      breathingGreen(); // Use green color for breathing effect
      break;

    case 4: // Breathing effect animation (Blue)
      breathingBlue(); // Use blue color for breathing effect
      break;

    case 5: // Breathing effect animation (Reddish-Orange)
      breathingRedOrange(); // Use reddish-orange color for breathing effect
      break;

    default: // Blank or default animation
      fill(CRGB::Black);
      FastLED.show();
      break;
    }

    // Animation update logic for spinner and pulse effects
    if (mode < 3) {  // Breathing effect has its own timing, so skip this part for modes 3, 4, 5
      counter = ++counter % NUM_LEDS;
      ratio = min(1.0, (double)(counter * stepSize + (millis() - stepSize)) / 1000);
      if (counter == 0) {
        up = !up; // Swap direction
      }
    }

    // Task delay for smooth animation updates (except breathing which has its own delay)
    if (mode < 3) {
      vTaskDelay(40 / portTICK_PERIOD_MS); // 40ms delay for other effects
    }
  }
}

#endif // STATUS_LED_H

