import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthContext } from './authContext';
import SignUpScreen from '@/app/auth/SignUpScreen';
import { Link } from 'expo-router';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return <ActivityIndicator size="large" />;
  }

  return auth.isAuthenticated ? (
    <>{children}</>
  ) : (
    <SignUpScreen />
  );
};

export default ProtectedRoute;
