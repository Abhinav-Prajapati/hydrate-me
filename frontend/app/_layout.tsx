import { Stack } from "expo-router";
import { AuthProvider } from "@/context/authContext";
import ProtectedRoute from "@/context/ProtectedRoute";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import useAuthStore from "@/store/useAuthStore";

export default function RootLayout() {
  /*
   * fetch user session and so it is acessable to entire application
   * */
  const fetchSession = useAuthStore((state) => state.fetchSession);
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);
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
