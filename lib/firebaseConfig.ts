import { initializeApp, getApps } from 'firebase/app';
import {
  getReactNativePersistence,
  initializeAuth,
  getAuth
} from 'firebase/auth/react-native';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDFZfegQS2ix6KHx3-0ABvCXvgCRls0ikw',
  authDomain: 'wallx-f913c.firebaseapp.com',
  projectId: 'wallx-f913c',
  storageBucket: 'wallx-f913c.appspot.com',
  messagingSenderId: '233862460108',
  appId: '1:233862460108:android:7d543306c307fe77230869',
};

// Prevent re-initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Only initializeAuth once
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (e) {
  // fallback if already initialized
  auth = getAuth(app);
}

const db = getFirestore(app);

export { auth, db };
