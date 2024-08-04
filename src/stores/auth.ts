// src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { auth, db } from '@/firebaseConfig';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';


export const useAuthStore = defineStore('auth', () => {

  const user = ref();
  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    user.value = userCredential.user;
    

  };

  const logout = async () => {
    await signOut(auth);
    user.value = null;
  };

  return {
    user,
    login,
    logout,
  };
});


