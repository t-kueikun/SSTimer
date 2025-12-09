import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBQSI2fFM6Ez4iUyLoiIbn5EEea2_S9264",
    authDomain: "ss-timer.firebaseapp.com",
    projectId: "ss-timer",
    storageBucket: "ss-timer.firebasestorage.app",
    messagingSenderId: "381666809902",
    appId: "1:381666809902:web:5349e9aefdcee22bc9a7bf",
    measurementId: "G-0LXBE0WH6V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Analytics removed to prevent potential init errors/blocking
// const analytics = getAnalytics(app);

// Export services for usage in components
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
