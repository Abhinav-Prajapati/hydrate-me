import { useAuth } from '@/context/authContext';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { View, Text, StyleSheet, Switch, Vibration } from 'react-native';

export default function Tab() {
  const { signOut } = useAuth()
  return (
    <LinearGradient
      colors={['#1A5C87', '#19233e']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
      </View>

      <View>
        <Text style={{ color: '#fff', fontSize: 22, paddingBottom: 8, paddingLeft: 15, fontFamily: 'Comfortaa-Regular' }}>
          Account
        </Text>
        <View style={[styles.accoutCard, styles.templateCard]}>
          <View style={styles.profileImageContainer}>
          </View>
          <View style={{ justifyContent: 'center', paddingLeft: 12 }}>
            <Text style={{ color: '#fff', fontSize: 22, paddingBottom: 10, fontFamily: 'Comfortaa-Regular' }}>Salty blaze</Text>
            <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'Comfortaa-Light' }}>user1@gmail.com</Text>
          </View>
        </View>
      </View>

      <HydrationGoal />
    </LinearGradient>
  );
}

const HydrationGoal = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [value, setValue] = useState(0);

  const handleSliderChange = (sliderValue: any) => {
    setValue(sliderValue);
    Vibration.vibrate(10); // Vibrates for 50ms when slider value changes
  };

  return (
    <View style={hydrationGoalStyle.container}>
      <Text style={hydrationGoalStyle.title}>Hydration Goal</Text>
      <View style={hydrationGoalStyle.card}>
        <Text style={hydrationGoalStyle.goalText}>{`${isEnabled ? dailyGoal : value} ml/day`}</Text>
        <View style={hydrationGoalStyle.row}>
          <Text style={[hydrationGoalStyle.rowText, { color: isEnabled ? '#fff' : '#767577' }]}>
            Use Recommended
          </Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isEnabled ? '#1fadff' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        {
          !isEnabled && (
            <Slider
              style={{ flex: 1, paddingVertical: 20 }}
              minimumValue={250}
              maximumValue={5000}
              step={250}
              value={value}
              onValueChange={handleSliderChange}
              minimumTrackTintColor="#1E90FF"  // Color before slider thumb
              maximumTrackTintColor="#D3D3D3"  // Color after slider thumb
              thumbTintColor="#1E90FF"         // Thumb (circle) color
            />
          )
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: 30,

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
  templateCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
  },
  accoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 150,
    marginHorizontal: 15,
    padding: 15,
  },
  hydrationGoalCard: {
    justifyContent: 'flex-start',
    height: 150,
    marginHorizontal: 15,
    padding: 15,
  },
  profileImageContainer: {
    borderWidth: 1,
    height: 115,
    width: 115,
    borderRadius: 100,
  }
});


const hydrationGoalStyle = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    paddingBottom: 8,
    paddingLeft: 15,
    fontFamily: 'Comfortaa-Regular',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    justifyContent: 'flex-start',
    marginHorizontal: 15,
    paddingVertical: 10,
  },
  goalText: {
    color: '#fff',
    fontSize: 22,
    paddingBottom: 8,
    paddingLeft: 15,
    fontFamily: 'Comfortaa-Regular',
  },
  row: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#fff',
    marginHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowText: {
    fontSize: 14,
    fontFamily: 'Comfortaa-Regular',
  },
})
