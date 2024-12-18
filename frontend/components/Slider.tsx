import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Vibration,
} from 'react-native';

interface CustomSliderProps {
  height?: number;
  width?: number;
  thumbColor?: string;
  activeTrackColor?: string;
  inactiveTrackColor?: string;
  initialValue?: number;
  maxValue?: number;
  step?: number;
  onValueChange?: (value: number) => void;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  height = 240,
  width = 80,
  activeTrackColor = 'blue',
  inactiveTrackColor = 'rgba(100, 100, 100, 0.3)',
  initialValue = 50,
  maxValue = 1000,
  step = 10,
  onValueChange = () => { },
}) => {
  const [sliderValue, setSliderValue] = useState(initialValue);
  const sliderRef = useRef<View>(null);

  const roundToStep = (value: number) => {
    return Math.round(value / step) * step;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        sliderRef.current?.measure((x, y, width, height, pageX, pageY) => {
          const touchY = gestureState.moveY - pageY;
          let value = Math.max(
            0,
            Math.min(maxValue, maxValue - (touchY / height) * maxValue)
          );

          value = roundToStep(value);

          setSliderValue(value);

          onValueChange(value);
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
          <View
            style={[
              styles.activeTrack,
              { height: `${(sliderValue / maxValue) * 100}%`, backgroundColor: activeTrackColor }
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
