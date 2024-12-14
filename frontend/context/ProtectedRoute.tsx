import React from 'react';
import { useAuth } from './authContext';
import Auth from '@/components/Auth';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session } = useAuth();

  // While checking session state, display a loading spinner
  if (session === undefined) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1fadff" />
      </View>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default ProtectedRoute;
