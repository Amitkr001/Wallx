import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../lib/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePasswordStrength = (pass: string) => {
    setPassword(pass);
    if (pass.length < 6) {
      setPasswordStrength('Weak');
    } else if (pass.match(/[A-Z]/) && pass.match(/[0-9]/) && pass.length >= 8) {
      setPasswordStrength('Strong');
    } else {
      setPasswordStrength('Medium');
    }
  };

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send verification email
      await sendEmailVerification(user);

      // Store user info in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email,
        username,
        createdAt: new Date(),
      });

      setLoading(false);
      Alert.alert(
        'Account Created!',
        'A verification email has been sent. Please verify your email before logging in.'
      );
      router.replace('/login');
    } catch (error: any) {
      setLoading(false);
      Alert.alert('Registration Failed', error.message);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/night-3078326_640.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.7)']}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.title}>📝 Create Account</Text>
          <Text style={styles.subtitle}>Join and start exploring</Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#ccc"
            onChangeText={setUsername}
            value={username}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#ccc"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={setEmail}
            value={email}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ccc"
            secureTextEntry
            onChangeText={handlePasswordStrength}
            value={password}
          />

          {password ? (
            <Text style={[styles.strength, {
              color:
                passwordStrength === 'Weak' ? '#ff4d4d' :
                passwordStrength === 'Medium' ? '#ffa500' :
                '#00ff7f'
            }]}>
              Password Strength: {passwordStrength}
            </Text>
          ) : null}

          <TouchableOpacity style={styles.loginButton} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <FontAwesome name="user-plus" size={20} color="#fff" />
                <Text style={styles.loginText}>Register</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => router.replace('/login')}
          >
            <Text style={styles.registerText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 40,
    opacity: 0.8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  strength: {
    marginBottom: 12,
    marginLeft: 4,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#00C6FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
    shadowColor: '#00C6FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
});
