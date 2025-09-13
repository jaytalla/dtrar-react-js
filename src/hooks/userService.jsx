// userService.jsx
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

// Check if user record exists
export const checkUserRecord = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user found");

  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  return docSnap.exists() ? { exists: true, data: docSnap.data() } : { exists: false };
};

// Create user record
export const createUserRecord = async (formData) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user found");

  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    ...formData,
    createdAt: new Date().toISOString(),
  });

  return { uid: user.uid, email: user.email, ...formData };
};
