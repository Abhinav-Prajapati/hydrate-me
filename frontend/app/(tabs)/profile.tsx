import { useAuth } from '@/context/authContext';
import { Button } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet } from 'react-native';

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

      <View style={[styles.accoutCard, styles.templateCard]}>
        <View style={styles.profileImageContainer}>
        </View>
        <View style={{ justifyContent: 'center', paddingLeft: 12 }}>
          <Text style={{ color: '#fff', fontSize: 22, paddingBottom: 10, fontFamily: 'Comfortaa-Regular' }}>Salty blaze</Text>
          <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'Comfortaa-Light' }}>user1@gmail.com</Text>
        </View>
      </View>
      <Button title='Logout' onPress={signOut}></Button>
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
  profileImageContainer: {
    borderWidth: 1,
    height: 115,
    width: 115,
    borderRadius: 100,
  }
});
