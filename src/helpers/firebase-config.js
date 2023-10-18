import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCvulnAf54J28shD60LEEPibJGygJ-ztmw',
  authDomain: 'serverless-78657.firebaseapp.com',
  projectId: 'serverless-78657',
  storageBucket: 'serverless-78657.appspot.com',
  messagingSenderId: '66338691745',
  appId: '1:66338691745:web:232948637e16d403692ee0',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();

export const db = getFirestore(app);
