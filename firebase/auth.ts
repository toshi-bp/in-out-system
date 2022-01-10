import firebaseApp from "./firebase";
import {
  getAuth,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  signInWithRedirect,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  Timestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";
import { User } from "../interfaces/login";
import Router from "next/router";

const provider = new GoogleAuthProvider();

export const login = async () => {
  // const auth = getAuth(firebaseApp);
  const auth = getAuth(firebaseApp);
  signInWithRedirect(auth, provider);
  // const q = query(collection(db, "users"), where(""))
};

export const logout = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const auth = getAuth(firebaseApp);
    signOut(auth)
      .then(() => resolve)
      .catch((error) => reject(error));
    Router.push("/");
  });
};

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  const auth = getAuth(firebaseApp);
  onFirebaseAuthStateChanged(auth, (user) => {
    const userInfo: User | null = user
      ? {
          displayName: user?.displayName,
          email: user?.email,
        }
      : null;
    callback(userInfo);
  });
};
