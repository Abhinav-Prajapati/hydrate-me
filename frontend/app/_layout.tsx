import { Stack } from "expo-router";
import { AuthProvider } from "@/context/authContext";
import ProtectedRoute from "@/context/ProtectedRoute";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <Stack>
          <Stack.Screen options={{ headerShown: false }} name="(tabs)" />
        </Stack>
      </ProtectedRoute>
    </AuthProvider>
  );
}
