import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = typeof window !== "undefined" && firebaseConfig.apiKey && firebaseConfig.projectId ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;

export async function signInWithGoogle() {
  if (!auth) throw new Error("Firebase non configuré");
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return { user: result.user, provider: "google" };
}

export async function signInWithApple() {
  if (!auth) throw new Error("Firebase non configuré");
  const provider = new OAuthProvider("apple.com");
  provider.addScope("email");
  provider.addScope("name");
  const result = await signInWithPopup(auth, provider);
  return { user: result.user, provider: "apple" };
}

export async function signUpWithEmail(email, password) {
  if (!auth) throw new Error("Firebase non configuré");
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return { user: result.user, provider: "email" };
}

export async function signInWithEmail(email, password) {
  if (!auth) throw new Error("Firebase non configuré");
  const result = await signInWithEmailAndPassword(auth, email, password);
  return { user: result.user, provider: "email" };
}

export async function logout() {
  if (auth) await signOut(auth);
}

export function subscribeToAuth(callback) {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
}
