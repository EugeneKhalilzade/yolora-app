import auth from '@react-native-firebase/auth';

const isFirebaseConfigured = (): boolean => {
  try {
    return !!auth().app;
  } catch {
    return false;
  }
};

export const initializeFirebase = () => {
  if (!isFirebaseConfigured()) {
    console.warn(
      'Firebase is not configured. Add google-services.json / GoogleService-Info.plist to enable Firebase auth.',
    );
  }
};

export const registerWithFirebase = async (
  email: string,
  password: string,
): Promise<{ uid: string; idToken: string } | null> => {
  if (!isFirebaseConfigured()) {
    return null;
  }

  const credential = await auth().createUserWithEmailAndPassword(email, password);
  const uid = credential.user.uid;
  const idToken = await credential.user.getIdToken();
  return { uid, idToken };
};

export const loginWithFirebase = async (
  email: string,
  password: string,
): Promise<{ uid: string; idToken: string } | null> => {
  if (!isFirebaseConfigured()) {
    return null;
  }

  const credential = await auth().signInWithEmailAndPassword(email, password);
  const uid = credential.user.uid;
  const idToken = await credential.user.getIdToken();
  return { uid, idToken };
};

export const signOutFirebase = async (): Promise<void> => {
  if (!isFirebaseConfigured()) {
    return;
  }
  await auth().signOut();
};

export const getFirebaseToken = async (): Promise<string | null> => {
  if (!isFirebaseConfigured()) {
    return null;
  }
  const user = auth().currentUser;
  return user ? user.getIdToken() : null;
};
