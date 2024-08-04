import { getAuth } from "firebase/auth";
import { initializeApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore';

// Tu configuración de Firebase
export const firebaseApp = initializeApp({
  apiKey: "AIzaSyAa-JPrdpvPldyGgTuwgHxjbbf9B4QnXvg",
  authDomain: "francisspa-ab54c.firebaseapp.com",
  projectId: "francisspa-ab54c",
  storageBucket: "francisspa-ab54c.appspot.com",
  messagingSenderId: "469056988793",
  appId: "1:469056988793:web:5c4ee4f6f6560ed58cd6a8"
})

const db: Firestore = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { auth, db};