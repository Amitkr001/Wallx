import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';

type AuthContextType = {
  user: User | null;
  initializing: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  initializing: true,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('👀 Firebase Auth changed:', firebaseUser);
      
      if (firebaseUser) {
        // Create or update user document in Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
          // Create new user document
          await setDoc(userRef, {
            email: firebaseUser.email,
            username: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          });
          console.log('✅ Created new user document');
        } else {
          // Update last login
          await setDoc(userRef, {
            lastLogin: new Date().toISOString(),
          }, { merge: true });
          console.log('✅ Updated user document');
        }
      }
      
      setUser(firebaseUser ?? null);
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('👋 User signed out');
    } catch (error) {
      console.error('❌ Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, logout, initializing }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
