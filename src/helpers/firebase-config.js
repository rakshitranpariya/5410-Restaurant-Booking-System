import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDA99hW2TaCeMlo_TLFsX2AKKJJncpCSNc',
  authDomain: 'serverless-group2.firebaseapp.com',
  projectId: 'serverless-group2',
  storageBucket: 'serverless-group2.appspot.com',
  messagingSenderId: '517492697080',
  appId: '1:517492697080:web:1cb70bd83f0dc66abb980d',
  measurementId: 'G-KL4Q8H339E',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
