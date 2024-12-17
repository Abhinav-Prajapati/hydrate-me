import { useAuth } from '@/context/authContext';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, Vibration, Image } from 'react-native';
import { useProfileStore } from '@/store/useStore';

export default function Tab() {
  const { session } = useAuth()
  const [jwtToken, setJwtToken] = useState<string | null>()
  const { userProfile, fetchUserProfile } = useProfileStore()

  useEffect(() => {
    setJwtToken(session?.access_token)
  })

  useEffect(() => {
    if (jwtToken) {
      fetchUserProfile(jwtToken)
    }
  }, [jwtToken])

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
            <Image
              style={{ width: 115, height: 115 }}
              source={{ uri: "https://bbowbmhjzlbxylrpbges.supabase.co/storage/v1/object/sign/avatars/Profile_pic.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL1Byb2ZpbGVfcGljLmpwZWciLCJpYXQiOjE3MzQ0NDkwMTcsImV4cCI6MTc2NTk4NTAxN30.VIWKm7aCJ-S8zGUpMC_ipdVvlOIu1TMksfnSsQrRgEM&t=2024-12-17T15%3A23%3A37.672Z" }} />
          </View>
          <View style={{ justifyContent: 'center', paddingLeft: 12 }}>
            <Text style={{ color: '#fff', fontSize: 22, paddingBottom: 10, fontFamily: 'Comfortaa-Regular' }}>{userProfile?.username}</Text>
            <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'Comfortaa-Light' }}>{userProfile?.email}</Text>
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
    Vibration.vibrate(20);
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
    borderColor: '#fff',
    height: 115,
    width: 115,
    borderRadius: 100,
    overflow: 'hidden',
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
