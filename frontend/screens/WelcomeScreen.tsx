import React, { useContext, useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import { AuthContext } from '@/context/authContext';
import { Link } from 'expo-router';

export default function Main() {
  const auth = useContext(AuthContext);

  if (!auth) {
    return (
      <View>
        <Text>Error: AuthContext not found!</Text>
        <Link href="/auth/SignInScreen">Log in</Link>
      </View>
    );
  }

  const { user, login, logout, isAuthenticated } = auth;

  return (
    <View>
      {isAuthenticated ? (
        <View>
          <Text>User name {user}</Text>
          <Text>User Authenticated ? {isAuthenticated ? "yes" : "no"}</Text>
          <Link href="/auth/SignInScreen">Log in</Link>
          <Button
            title='LogOut'
            onPress={() => { logout() }}
          />
        </View>
      ) : (
        <View>
          <Text>Mf u are not logged in</Text>
          <Link href="/auth/SignInScreen">Log in</Link>
        </View>
      )}
    </View>
  );
}
