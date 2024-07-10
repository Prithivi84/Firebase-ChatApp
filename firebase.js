import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
// import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCRKzLjEsWJWqAzZmpyXNuiDovlJPZxABE",
  authDomain: "furi-app-5e940.firebaseapp.com",
  projectId: "furi-app-5e940",
  storageBucket: "furi-app-5e940.appspot.com",
  messagingSenderId: "25770216044",
  appId: "1:25770216044:web:0b1f2675b4138055a9a649",
  measurementId: "G-0NFGZLW0WV",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export const usersRef = collection(db, "users");
export const roomRef = collection(db, "rooms");
