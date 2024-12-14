import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { login, LoginParams } from '@/api/auth';
import { AuthContext } from '@/context/authContext'; // No need to import AuthProvider unless you're wrapping the app
import { useRouter } from 'expo-router'; // Correct hook for routing with expo-router

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter(); // Using expo-router's useRouter hook

  const auth = useContext(AuthContext);



  const handleSubmit = async () => {
    if (!username || !password) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError(null);

    const loginData: LoginParams = { username, password };
    const { success, data, error } = await login(loginData);

    if (success && data?.access_token) {
      auth?.login(data.access_token, username);
      router.push('/'); // Correct way to navigate using expo-router
    } else {
      setError(error || 'Unknown error occurred.');
    }
    setLoading(false);
  };

  return (
    <LinearGradient
      colors={['#1A5C87', '#003F71']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.header}>Welcome Back!</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#ccc"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: loading || !username || !password ? '#ccc' : '#007BFF' },
        ]}
        disabled={loading || !username || !password}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Log In'}</Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1A5C87',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 18,
    color: '#fff',
    marginBottom: 18,
    fontSize: 18,
  },
  button: {
    padding: 15,
    borderRadius: 100,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});


export const options = {
  headerShown: false,
};

export default LoginScreen;
