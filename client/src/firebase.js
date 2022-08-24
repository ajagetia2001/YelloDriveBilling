import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDVCXAyy40Iu5vyhedWIsAZQSRsIGm4zyM",
  authDomain: "auth-dev-yd.firebaseapp.com",
  databaseURL:
    "https://auth-dev-yd-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "auth-dev-yd",
  storageBucket: "auth-dev-yd.appspot.com",
  messagingSenderId: "593825921656",
  appId: "1:593825921656:web:2d7d29eaa7e051924c8b8d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();

export const database = getDatabase(app);
export default app;
