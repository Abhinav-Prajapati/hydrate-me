import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Text,
} from 'react-native';

interface CustomSliderProps {
  height?: number;
  width?: number;
  thumbColor?: string;
  activeTrackColor?: string;
  inactiveTrackColor?: string;
  initialValue?: number;
  maxValue?: number; // New prop for max value
  onValueChange?: (value: number) => void;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  height = 240, // Default height
  width = 80, // Default width
  thumbColor = 'blue', // Default thumb color
  activeTrackColor = 'blue', // Default active track color
  inactiveTrackColor = 'rgba(100, 100, 100, 0.3)', // Default inactive track color
  initialValue = 50, // Default initial value
  maxValue = 100, // Default max value
  onValueChange = () => { }, // Default callback
}) => {
  const [sliderValue, setSliderValue] = useState(initialValue); // Slider value state
  const sliderRef = useRef<View>(null);

  // Create a PanResponder to handle gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Get the touch position relative to the slider
        sliderRef.current?.measure((x, y, width, height, pageX, pageY) => {
          const touchY = gestureState.moveY - pageY; // Relative Y position
          const value = Math.max(
            0,
            Math.min(maxValue, maxValue - (touchY / height) * maxValue) // Convert Y position to value and use maxValue
          );
          setSliderValue(value);
          onValueChange(value); // Trigger callback
        });
      },
    })
  ).current;

  return (
    <View style={[styles.container, { height, width }]}>
      <View style={[styles.sliderContainer, { height, width }]}>
        <View
          ref={sliderRef}
          style={[styles.sliderTrack, { height, width, backgroundColor: inactiveTrackColor }]}
          {...panResponder.panHandlers} // Attach PanResponder handlers
        >
          {/* Active Track */}
          <View
            style={[
              styles.activeTrack,
              { height: `${(sliderValue / maxValue) * 100}%`, backgroundColor: activeTrackColor }, // Adjust active track based on maxValue
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 240,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderContainer: {
    justifyContent: 'center',
  },
  sliderTrack: {
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 100,
  },
  activeTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
  },
});

export default CustomSlider;
