import { getAuth } from "firebase/auth";
import { app } from "./firebase"; // ou o caminho onde está sua config do Firebase
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";

export const auth = getAuth(app);

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, loading };
}