import { initializeApp } from "firebase/app";
import { getAuth, type User } from "firebase/auth";
import { getFirestore, Timestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env["VITE_API_KEY"],
  authDomain: import.meta.env["VITE_AUTH_DOMAIN"],
  projectId: import.meta.env["VITE_PROJECT_ID"],
  storageBucket: import.meta.env["VITE_STORAGE_BUCKET"],
  messagingSenderId: import.meta.env["VITE_MESSAGING_SENDER_ID"],
  appId: import.meta.env["VITE_APP_ID"],
  measurementId: import.meta.env["VITE_MEASUREMENT_ID"],
};

export const firebaseApp = initializeApp(firebaseConfig);
export const fireauth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const firestorage = getStorage(firebaseApp);

export const getCurrentUser = async (): Promise<User> =>
  new Promise((resolve, reject) => {
    const unsubscribe = fireauth.onAuthStateChanged((user) => {
      unsubscribe();
      if (!user) return reject("User not found");
      resolve(user);
    }, reject);
  });

export const formatTimestamp = (timestamp: Timestamp) => {
  const parsedDate = new Date(timestamp.seconds * 1000);

  return parsedDate.toLocaleDateString("pt-BR", { timeZone: "UTC" });
};
