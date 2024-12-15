import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { Slider } from '@miblanchard/react-native-slider';
import CustomSlider from '@/components/Slider';
export default function WaterTracker() {
  const [isEnabled, setIsEnabled] = useState(true);

  let [fontsLoading] = useFonts({
    'Comfortaa-Regular': require('../../assets/fonts/Comfortaa-Regular.ttf'),
    'Comfortaa-Bold': require('../../assets/fonts/Comfortaa-Bold.ttf'),
    'Comfortaa-Light': require('../../assets/fonts/Comfortaa-Light.ttf'),
  });

  if (!fontsLoading) {
    return <AppLoading />;
  }

  const [selectedWaterLevel, setValue] = useState<number>(200);

  const toggleSwitch = () => setIsEnabled((prev) => !prev);

  return (
    <LinearGradient
      colors={['#1A5C87', '#19233e']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Add Drink</Text>
      </View>

      {/* Date and Time */}
      <View style={styles.dateTimeContainer}>
        <Text style={{
          color: 'white',
          fontSize: 18,
        }}>Date</Text>
        <Text style={styles.dateText}>14 December 2024</Text>
        <Text style={styles.timeText}>9:17 pm</Text>
      </View>

      {/* Count towards goal toggle */}
      <View style={styles.SliderContainer}>
        <Text style={styles.toggleLabel}>Count towards goal</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#39c1ff' }}
          thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>

      {/* Drink Level */}
      <View style={{ alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 40, color: "white" }}>
            {selectedWaterLevel}
          </Text>
          <Text style={{ fontSize: 16, color: "white", paddingBottom: 7, paddingLeft: 3 }}>
            ml
          </Text>
        </View>
        <CustomSlider
          height={270}
          width={100}
          maxValue={500}
          thumbColor="red"
          activeTrackColor="#20a8f6"
          inactiveTrackColor="rgba(255, 255, 255, 0.1)"
          initialValue={selectedWaterLevel}
          onValueChange={(value) => { setValue(Math.round(value)) }}
        />
      </View>

      {/* Drink Types */}
      <View style={styles.drinkTypeContainer}>
        {['Water', 'Coffee', 'Energy Mix', 'Electrolyte Mix', 'Tea'].map(
          (type, index) => (
            <TouchableOpacity key={index} style={styles.drinkTypeButton}>
              <Text style={styles.drinkTypeText}>{type}</Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Save Button */}
      <View style={{ alignItems: 'center', paddingBottom: 15 }}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    paddingTop: 40,
    paddingBottom: 10,
    paddingLeft: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'Comfortaa-Bold'
  },
  dateTimeContainer: {
    alignItems: 'center',
    marginHorizontal: 15,
    paddingVertical: 15,
    flexDirection: 'row',
    borderColor: 'white',
    borderBottomWidth: 1,
    justifyContent: 'space-between',

  },
  dateText: {
    color: '#fff',
    fontSize: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 8,
  },
  timeText: {
    color: '#fff',
    fontSize: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 8,
  },
  SliderContainer: {
    marginHorizontal: 15,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    color: '#fff',
    fontSize: 16,
  },
  drinkLevel: {
    color: '#fff',
    fontSize: 42,
    textAlign: 'center',
    marginVertical: 10,
  },
  presetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  presetButton: {
    backgroundColor: '#2b6eb8',
    padding: 10,
    borderRadius: 10,
  },
  presetText: {
    color: '#fff',
    fontSize: 16,
  },
  drinkTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  drinkTypeButton: {
    alignItems: 'center',
  },
  drinkTypeText: {
    color: '#fff',
    fontSize: 12,
  },
  saveButton: {
    backgroundColor: '#1f9aff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    height: 55,
    marginTop: 20,
    width: '50%'
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  slider: {
    width: 300,
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#c4c4c4',
  },
});



