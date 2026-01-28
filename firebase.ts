// Fix: Ensure modular initializeApp is imported correctly from the firebase/app entry point
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDbeuYDDjG9sMvILp7-WWD-NXz42VL0yR4",
  authDomain: "oswald-8594f.firebaseapp.com",
  projectId: "oswald-8594f",
  storageBucket: "oswald-8594f.firebasestorage.app",
  messagingSenderId: "315064151109",
  appId: "1:315064151109:web:fc47c45c81fda2f2cec72c",
  measurementId: "G-BC73PMRJYE"
};

// Initialize the Firebase app instance
const app = initializeApp(firebaseConfig);

// Export the Firestore database instance
export const db = getFirestore(app);