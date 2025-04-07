import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDFZfegQS2ix6KHx3-0ABvCXvgCRls0ikw',
  authDomain: 'wallx-f913c.firebaseapp.com',
  projectId: 'wallx-f913c',
  storageBucket: 'wallx-f913c.appspot.com',
  messagingSenderId: '233862460108',
  appId: '1:233862460108:android:7d543306c307fe77230869',
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app); // 👈 Firestore initialized here

export { auth, db };
