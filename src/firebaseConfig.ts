// src/firebase.ts
// import { initializeApp } from 'firebase/app';
// import { getAuth } from "firebase/auth";
// import { getFirestore, Firestore } from 'firebase/firestore';
// import { getStorage } from "firebase/storage";

// // Tu configuración de Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyBKMgPgp3aLijyn3HUjQj_1M1r9uiX2F6Q",
//   authDomain: "cuentas-claras-be6b9.firebaseapp.com",
//   databaseURL: "https://cuentas-claras-be6b9-default-rtdb.firebaseio.com",
//   projectId: "cuentas-claras-be6b9",
//   storageBucket: "cuentas-claras-be6b9.appspot.com",
//   messagingSenderId: "424561552217",
//   appId: "1:424561552217:web:c851d8b1b0bfb45c17fa48"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db: Firestore = getFirestore(app);

//export { auth, db };
import { getAuth } from "firebase/auth";
import { initializeApp } from 'firebase/app'
//import { getDatabase, onValue } from 'firebase/database';
import { getFirestore, Firestore } from 'firebase/firestore';
// ... other firebase imports

// Tu configuración de Firebase
export const firebaseApp = initializeApp({
  databaseURL: "https://cuentas-claras-be6b9-default-rtdb.firebaseio.com",
  
  apiKey: "AIzaSyAa-JPrdpvPldyGgTuwgHxjbbf9B4QnXvg",
  authDomain: "francisspa-ab54c.firebaseapp.com",
  projectId: "francisspa-ab54c",
  storageBucket: "francisspa-ab54c.appspot.com",
  messagingSenderId: "469056988793",
  appId: "1:469056988793:web:5c4ee4f6f6560ed58cd6a8"
})

// used for the firestore refs
//const db = getDatabase(firebaseApp)
const db: Firestore = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { auth, db};