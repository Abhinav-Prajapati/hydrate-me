import { useAuth } from '@/context/authContext';
import { Button } from '@rneui/themed';
import { View, Text, StyleSheet } from 'react-native';

export default function Tab() {
  const { signOut } = useAuth()

  return (
    <View style={styles.container}>
      <Text>Profile</Text>
      <Button title='Logout' onPress={signOut}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
