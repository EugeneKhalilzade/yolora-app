// ──────────────────────────────────────────────
// Yolora — Firebase Service (Placeholder)
// ──────────────────────────────────────────────

// In production, initialize Firebase here:
// import firebase from '@react-native-firebase/app';
// import auth from '@react-native-firebase/auth';

// For hackathon MVP, we use direct backend auth.
// Firebase integration can be added by:
// 1. Adding google-services.json to android/app/
// 2. Uncommenting the Firebase imports above
// 3. Using firebase auth().createUserWithEmailAndPassword()
// 4. Sending the ID token to backend for verification

export const initializeFirebase = () => {
  console.log('Firebase: Using backend-direct auth for MVP');
};

export const getFirebaseToken = async (): Promise<string | null> => {
  // In production:
  // const user = auth().currentUser;
  // return user ? await user.getIdToken() : null;
  return null;
};
