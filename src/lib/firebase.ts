// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "focal-column-197904.firebaseapp.com",
  projectId: "focal-column-197904",
  storageBucket: "focal-column-197904.appspot.com",
  messagingSenderId: "538445142105",
  appId: "1:538445142105:web:2c529b53255ca0cf5023d3",
  measurementId: "G-YV5C0J5ZEX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics if it is supported
const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

export { app, analytics };
