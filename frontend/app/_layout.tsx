import { Stack } from "expo-router";
import { AuthContext, AuthProvider } from "@/context/authContext";  // Import AuthContext
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          options={{ headerShown: false }}
          name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}
