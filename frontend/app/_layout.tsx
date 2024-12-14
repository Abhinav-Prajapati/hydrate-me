import { Stack } from "expo-router";
import { AuthProvider } from "@/context/authContext";
import ProtectedRoute from "@/context/ProtectedRoute";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <StatusBar backgroundColor="transparent" />
        <Stack>
          <Stack.Screen options={{ headerShown: false }} name="(tabs)" />
        </Stack>
      </ProtectedRoute>
    </AuthProvider>
  );
}
