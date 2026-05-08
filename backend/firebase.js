import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "tensorbell.firebaseapp.com",
  projectId: "tensorbell",
  storageBucket: "tensorbell.firebasestorage.app",
  messagingSenderId: "474669627965",
  appId: "1:474669627965:web:97f35c48c275ca1d71c854"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);