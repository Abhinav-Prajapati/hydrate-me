import React, { useEffect, useState } from 'react';
import * as Haptics from 'expo-haptics';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import CustomSlider from '@/components/Slider';
import { useAuth } from '@/context/authContext';
import { addWaterIntake } from '@/api';
import { useStore } from '@/store/useStore';

export default function WaterTracker() {
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(true);
  const [selectedWaterLevel, setSelectedWaterLevel] = useState<number>(200);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { fetchUserWaterData } = useStore();

  let [fontsLoading] = useFonts({
    'Comfortaa-Regular': require('../../assets/fonts/Comfortaa-Regular.ttf'),
    'Comfortaa-Bold': require('../../assets/fonts/Comfortaa-Bold.ttf'),
    'Comfortaa-Light': require('../../assets/fonts/Comfortaa-Light.ttf'),
  });

  if (!fontsLoading) {
    return <AppLoading />;
  }

  const { session } = useAuth();

  useEffect(() => {
    if (session?.access_token) {
      setAccessToken(session.access_token);
      console.log(session.access_token);
    }
  }, [session]);

  useEffect(() => {
    Vibration.vibrate(5);
  }, [selectedWaterLevel])

  const toggleSwitch = () => setIsSwitchEnabled(prev => !prev);

  const handleAddWaterIntake = async () => {
    if (!accessToken) return;

    setIsLoading(true);
    try {
      await addWaterIntake('test_sensor', selectedWaterLevel, accessToken);
      fetchUserWaterData(accessToken);
    } catch (error) {
      console.error('Error adding water intake:', error);
    } finally {
      setIsLoading(false);
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      )
    }
  };

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
        <Text style={styles.dateText}>14 December 2024</Text>
        <Text style={styles.timeText}>9:17 pm</Text>
      </View>

      {/* Count towards goal toggle */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Count towards goal</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#39c1ff' }}
          thumbColor={isSwitchEnabled ? '#f4f3f4' : '#f4f3f4'}
          onValueChange={toggleSwitch}
          value={isSwitchEnabled}
        />
      </View>

      {/* Drink Level */}
      <View style={styles.sliderContainer}>
        <View style={styles.waterLevelDisplay}>
          <Text style={styles.waterLevelText}>{selectedWaterLevel}</Text>
          <Text style={styles.mlText}>ml</Text>
        </View>
        <CustomSlider
          height={270}
          width={100}
          maxValue={500}
          thumbColor="red"
          activeTrackColor="#20a8f6"
          inactiveTrackColor="rgba(255, 255, 255, 0.1)"
          initialValue={selectedWaterLevel}
          onValueChange={value => setSelectedWaterLevel(Math.round(value))}
          step={25}
        />
      </View>

      {/* Drink Types */}
      <View style={styles.drinkTypeContainer}>
        {['Water', 'Coffee', 'Energy Mix', 'Electrolyte Mix', 'Tea'].map((type, index) => (
          <TouchableOpacity key={index} style={styles.drinkTypeButton}>
            <Text style={styles.drinkTypeText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleAddWaterIntake}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
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
    fontFamily: 'Comfortaa-Bold',
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
  switchContainer: {
    marginHorizontal: 15,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    color: '#fff',
    fontSize: 16,
  },
  waterLevelDisplay: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  waterLevelText: {
    fontSize: 40,
    color: 'white',
  },
  mlText: {
    fontSize: 16,
    color: 'white',
    paddingBottom: 7,
    paddingLeft: 3,
  },
  sliderContainer: {
    alignItems: 'center',
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
  saveButtonContainer: {
    alignItems: 'center',
    paddingBottom: 15,
  },
  saveButton: {
    backgroundColor: '#1f9aff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    height: 55,
    width: '50%',
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  saveButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
