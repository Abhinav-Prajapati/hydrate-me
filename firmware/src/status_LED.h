#ifndef STATUS_LED_H
#define STATUS_LED_H

#include <FastLED.h>
#include <math.h>  // To use the sin() function for smooth transitions

// Declare external variables
//extern SemaphoreHandle_t xMutex;   // Declare mutex as extern
//extern int animation_mode;         // Declare animation mode as extern

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
const CRGB MUTE = CRGB(0, 0, 0);         // Black
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

#endif // STATUS_LED_H

