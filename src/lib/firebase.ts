// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // <- REEMPLAZA ESTO
  authDomain: "cteimanager.firebaseapp.com",
  projectId: "cteimanager",
  storageBucket: "cteimanager.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // <- REEMPLAZA ESTO
  appId: "YOUR_APP_ID", // <- REEMPLAZA ESTO
  measurementId: "YOUR_MEASUREMENT_ID" // <- REEMPLAZA ESTO
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics if it is supported
const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

export { app, analytics };
