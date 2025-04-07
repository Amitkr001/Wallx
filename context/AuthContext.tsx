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
    console.log('🔄 AuthProvider: Setting up auth listener');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('👀 Auth state changed:', firebaseUser ? 'User logged in' : 'No user');
      
      if (firebaseUser) {
        console.log('📝 Creating/updating user document...');
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userRef);
          
          if (!userDoc.exists()) {
            console.log('📄 Creating new user document');
            await setDoc(userRef, {
              email: firebaseUser.email,
              username: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
            });
          } else {
            console.log('📄 Updating existing user document');
            await setDoc(userRef, {
              lastLogin: new Date().toISOString(),
            }, { merge: true });
          }
        } catch (error) {
          console.error('❌ Error handling user document:', error);
        }
      }
      
      setUser(firebaseUser);
      setInitializing(false);
      console.log('✅ Auth state updated, initializing set to false');
    });

    return () => {
      console.log('🧹 Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      console.log('👋 Logging out user...');
      await signOut(auth);
      console.log('✅ User logged out successfully');
    } catch (error) {
      console.error('❌ Error during logout:', error);
    }
  };

  console.log('🔄 AuthProvider render:', { user, initializing });

  return (
    <AuthContext.Provider value={{ user, logout, initializing }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
