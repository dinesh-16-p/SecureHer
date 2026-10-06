import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../services/firebase/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Parse raw Firebase Auth error codes to user-friendly messages
export const parseAuthError = (error) => {
  if (!error || !error.code) return 'An error occurred. Please try again.';
  switch (error.code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password is too weak. Please choose at least 6 characters.';
    case 'auth/popup-closed-by-user':
      return 'Google Sign-In popup was closed before completing.';
    case 'auth/popup-blocked':
      return 'Google Sign-In popup was blocked by browser settings.';
    case 'auth/operation-not-allowed':
      return 'Google Sign-In is not enabled in Firebase Authentication. Please enable Google as a provider in Firebase Console.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    default:
      return error.message || 'Unable to authenticate. Please try again.';
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Monitor Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch User Profile from Firestore
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserProfile(userDocSnap.data());
          } else {
            // Profile doesn't exist yet (e.g. initial Google login)
            const newProfile = {
              uid: currentUser.uid,
              fullName: currentUser.displayName || 'User',
              email: currentUser.email || '',
              phone: currentUser.phoneNumber || '',
              profileImage: currentUser.photoURL || '',
              authProvider: currentUser.providerData[0]?.providerId || 'password',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            };
            await setDoc(userDocRef, newProfile, { merge: true });
            setUserProfile(newProfile);
          }
        } catch (err) {
          console.warn('Firestore profile fetch error:', err);
          setUserProfile({
            uid: currentUser.uid,
            fullName: currentUser.displayName || 'User',
            email: currentUser.email || ''
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Email/Password Signup with Profile & Emergency Contact creation
  const signup = async (userData) => {
    const { email, password, fullName, phone, emergencyContactName, emergencyContactPhone, emergencyContactEmail } = userData;
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const uid = res.user.uid;

    const profileData = {
      uid,
      fullName,
      email,
      phone: phone || '',
      profileImage: '',
      authProvider: 'password',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Store User Profile in Firestore
    await setDoc(doc(db, 'users', uid), profileData);
    setUserProfile(profileData);

    // Store Primary Emergency Contact if supplied
    if (emergencyContactName && (emergencyContactPhone || emergencyContactEmail)) {
      const contactsRef = collection(db, 'users', uid, 'emergencyContacts');
      await addDoc(contactsRef, {
        name: emergencyContactName,
        phone: emergencyContactPhone || '',
        email: emergencyContactEmail || '',
        relationship: 'Primary Contact',
        priority: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    return res.user;
  };

  // Email/Password Login
  const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  };

  // Google Sign-In
  const googleLogin = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    const currentUser = res.user;

    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      const newProfile = {
        uid: currentUser.uid,
        fullName: currentUser.displayName || 'User',
        email: currentUser.email || '',
        phone: currentUser.phoneNumber || '',
        profileImage: currentUser.photoURL || '',
        authProvider: 'google',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(userDocRef, newProfile, { merge: true });
      setUserProfile(newProfile);
    } else {
      setUserProfile(userDocSnap.data());
    }

    return currentUser;
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  // Password Reset
  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    userProfile,
    loading,
    login,
    signup,
    googleLogin,
    logout,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
