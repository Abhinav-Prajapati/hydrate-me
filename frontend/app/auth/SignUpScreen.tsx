import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { register, RegisterParams, RegisterResponse } from '@/api/auth';
import { AuthContext } from '@/context/authContext';
import { Link } from 'expo-router';

const SignUpScreen: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [disableButton, setDisableButton] = useState<boolean>(true);

  const auth = useContext(AuthContext);

  useEffect(() => {
    setDisableButton(!(name.trim() && email.trim() && password.trim()));
  }, [name, email, password]);

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    const userData: RegisterParams = { username: name, email, password };
    const { success, data, error } = await register(userData);

    if (success && data) {
      setMessage(`Registration successful! Welcome, ${data?.username}!`);
      auth?.login(data?.token, data?.username);
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
      <Text style={styles.header}>Let's Get You Hydrated</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#ccc"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
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
          { backgroundColor: (loading || disableButton) ? '#ccc' : '#007BFF' },
        ]}
        disabled={loading || disableButton}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Register'}</Text>
      </TouchableOpacity>
      <Text style={styles.footer}>
        {error && `Error: ${error}`}
      </Text>
      <View style={styles.containerLink}>
        <Text style={styles.text}>Already have an account?</Text>
        <Link href="/auth/SignInScreen" style={styles.link}>Sign In</Link>
      </View>

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
  footer: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
  containerLink: {
    flexDirection: 'row', // This makes the elements align side by side
    justifyContent: 'center', // Centers the content horizontally
    alignItems: 'center', // Centers the content vertically
    marginTop: 20,
  },
  text: {
    color: '#fff', // You can change the color as needed
    marginRight: 5, // Adds space between the Text and Link
  },
  link: {
    color: '#007BFF', // Style for the Link
  },
});

export const options = {
  headerShown: false, // This removes the header and title
};

export default SignUpScreen;
