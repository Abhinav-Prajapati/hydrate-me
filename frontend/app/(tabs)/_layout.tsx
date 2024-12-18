import { MaterialIcons, Feather, SimpleLineIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#eef4ff',
        tabBarInactiveTintColor: '#8c93a4',
        tabBarStyle: styles.tabBar,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color }) => <Feather size={24} name='home' color={color} />,
        }}
      />
      <Tabs.Screen
        name="social"
        options={{
          title: 'Social',
          tabBarIcon: ({ color }) => <Feather size={24} name='globe' color={color} />,
        }}
      />
      <Tabs.Screen
        name="addWaterIntake"
        options={{
          title: 'Add Drink',
          tabBarLabel: '',
          headerShown: false,
          tabBarIcon: ({ color }) =>
            <View style={{
              padding: 10,
              height: 50,
              width: 50,
              borderRadius: 100,
              backgroundColor: "#1fadff",
            }}>
              <Ionicons size={28} name="water-outline" color={'white'} />
            </View>
          ,
        }}
      />
      <Tabs.Screen
        name="bottles"
        options={{
          title: 'Bottles',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="bottle-wine-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: 'Profile',
          tabBarIcon: ({ color }) => <SimpleLineIcons size={24} name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#30384f',
    height: 55,
    borderTopWidth: 0, // Remove top border
  },
})
