import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, updateDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { User, UserRole } from './types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<boolean>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, displayName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isCashier: boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInProgress, setAuthInProgress] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          const superAdminEmails = ['mdanyalkayani77@gmail.com', 'gotify.pk@gmail.com', 'numl-s23-36974@numls.edu.pk', 'dkayani086@gmail.com'];
          const isSuperAdminEmail = superAdminEmails.includes(firebaseUser.email || '');

          let userData: User;

          if (!userSnap.exists()) {
            userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || '',
              role: isSuperAdminEmail ? 'admin' : 'customer',
              createdAt: new Date().toISOString(),
            };
            await setDoc(userRef, userData);
          } else {
            userData = userSnap.data() as User;
            if (isSuperAdminEmail && userData.role !== 'admin') {
              userData.role = 'admin';
              await updateDoc(userRef, { role: 'admin' });
            }
          }

          // Allow all users to stay logged in, including customers
          setUser(userData);
        } catch (error) {
          console.error('Auth sync error:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (): Promise<boolean> => {
    if (authInProgress) return false;
    setAuthInProgress(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Successfully logged in!');
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/popup-blocked') {
        toast.error('Sign-in popup was blocked by your browser. Please allow popups for this site.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        console.warn('AuthContext: Popup request cancelled or closed by user');
      } else if (error.code === 'auth/popup-closed-by-user') {
        console.log('AuthContext: Popup closed by user');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        toast.error('An account already exists with this email but with a different sign-in method. Please sign in with email/password.');
      } else {
        toast.error('Failed to log in. Please try again.');
      }
      return false;
    } finally {
      setAuthInProgress(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    if (authInProgress) return;
    setAuthInProgress(true);
    const normalizedEmail = email.toLowerCase().trim();
    console.log('AuthContext: Attempting email login for:', normalizedEmail);
    
    try {
      // Direct Firebase Auth login
      console.log('AuthContext: Trying Firebase Auth signInWithEmailAndPassword');
      await signInWithEmailAndPassword(auth, normalizedEmail, pass);
      console.log('AuthContext: Firebase Auth login successful');
      toast.success('Successfully logged in!');
    } catch (e: any) {
      console.error('AuthContext: Email login failed:', e.code, e.message);
      
      // Map common Firebase errors to user-friendly messages
      let errorMessage = 'Invalid email or password. Please double-check your credentials.';
      if (e.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later or reset your password.';
      } else if (e.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled. Please contact support.';
      } else if (e.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (e.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up first.';
      } else if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password. Please double-check your credentials.';
      }
      
      throw new Error(errorMessage);
    } finally {
      setAuthInProgress(false);
    }
  };

  const signUp = async (email: string, pass: string, displayName: string) => {
    if (authInProgress) return;
    setAuthInProgress(true);
    const normalizedEmail = email.toLowerCase().trim();
    console.log('AuthContext: Attempting sign up for:', normalizedEmail);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, normalizedEmail, pass);
      const firebaseUser = userCred.user;
      console.log('AuthContext: Firebase Auth user created:', firebaseUser.uid);
      
      await updateProfile(firebaseUser, { displayName });
      console.log('AuthContext: Profile updated with displayName:', displayName);
      
      const newUser: User = {
        uid: firebaseUser.uid,
        email: normalizedEmail,
        displayName,
        photoURL: '',
        role: 'customer',
        createdAt: new Date().toISOString(),
      };
      
      console.log('AuthContext: Attempting to create Firestore user doc');
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
        console.log('AuthContext: Firestore user doc created');
      } catch (e) {
        console.warn('AuthContext: Failed to create Firestore user doc during signup, onAuthStateChanged will retry');
      }
      
      setUser(newUser);
      toast.success('Account created successfully!');
    } catch (error: any) {
      let errorMessage = 'Failed to create account.';
      if (error.code === 'auth/email-already-in-use') {
        console.warn('AuthContext: Sign up - email already in use');
        errorMessage = 'This email is already registered. Please try signing in or use the "Forgot?" link to reset your password.';
      } else {
        console.error('AuthContext: Sign up error:', error);
        if (error.code === 'auth/weak-password') {
          errorMessage = 'Password is too weak. Please use at least 6 characters.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email address format.';
        } else if (error.code === 'auth/operation-not-allowed') {
          errorMessage = 'Email/Password signup is not enabled. Please contact the administrator.';
        }
      }
      throw new Error(errorMessage);
    } finally {
      setAuthInProgress(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { sendPasswordResetEmail } = await import('firebase/auth');
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.message || 'Failed to send reset email.');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('staff_session');
      setUser(null);
      toast.success('Successfully logged out!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out.');
    }
  };

  const isSuperAdmin = user?.email === 'mdanyalkayani77@gmail.com' || 
                         user?.email === 'gotify.pk@gmail.com' ||
                         user?.email === 'numl-s23-36974@numls.edu.pk' ||
                         user?.email === 'dkayani086@gmail.com';
  const isAdmin = user?.role === 'admin' || isSuperAdmin;
  const isCashier = user?.role === 'cashier';
  const isStaff = isAdmin || isCashier;

  useEffect(() => {
    if (user) {
      console.log('Auth State Updated:', {
        uid: user.uid,
        email: user.email,
        role: user.role,
        isAdmin,
        isSuperAdmin
      });
    }
  }, [user, isAdmin, isSuperAdmin]);

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithEmail, signUp, resetPassword, logout, isAdmin, isSuperAdmin, isCashier, isStaff }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
