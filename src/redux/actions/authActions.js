import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { auth, db, provider } from '../../helpers/firebase-config';

const userCollectionRef = collection(db, 'users');

export const loadUser = () => async dispatch => {
  try {
    onAuthStateChanged(auth, async currentUser => {
      if (currentUser) {
        await dispatch(getUserByEmail(currentUser.email, currentUser.accessToken));
      }
    });

    const token = localStorage.getItem('token');


    if (!token) return dispatch({ type: 'NEW_USER' });
    return true;
  } catch (err) {
    dispatch({ type: 'AUTH_FAILED' });
    return false;
  }
};

export const googleLogin = () => async dispatch => {
  try {
    const res = await signInWithPopup(auth, provider);
    const searchQuery = await query(userCollectionRef, where('email', '==', res.user.email));
    const searchData = await getDocs(searchQuery);
    if (searchData.docs.length === 0) await dispatch(register({ email: res.user.email }, true));
    await dispatch(loadUser());

    return true;
  } catch (err) {
    console.log(err);
    dispatch({ type: 'AUTH_FAILED' });
    return false;
  }
};

export const getUserByEmail = (email, accessToken) => async dispatch => {
  try {
    const searchQuery = await query(userCollectionRef, where('email', '==', email));

    const res = await getDocs(searchQuery);
    dispatch({ type: 'EXISTING_USER', payload: res.docs[0].data() });
    localStorage.setItem('token', accessToken);
    localStorage.setItem("userEmail",email)
  } catch (err) {
    console.log(err);
    dispatch({ type: 'AUTH_FAILED' });
    return false;
  }
};

export const register =
  (data, isGoogle = false) =>
    async () => {
      try {
        !isGoogle && (await createUserWithEmailAndPassword(auth, data?.email, data?.password));
        await addDoc(userCollectionRef, { email: data.email, type: '1' });
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    };

export const login = data => async dispatch => {
  try {
    const user = await signInWithEmailAndPassword(auth, data?.email, data?.password);
    dispatch({ type: 'EXISTING_USER', payload: user.user });
    localStorage.setItem('token', user?.user?.accessToken);
    // localStorage.setItem('userDetails', data?.email);
    localStorage.setItem('userEmail', data?.email);

    return true;
  } catch (err) {
    dispatch({ type: 'AUTH_FAILED' });
    return false;
  }
};

export const logout = () => async dispatch => {
  try {
    dispatch({ type: 'AUTH_FAILED' });
    await signOut(auth);
    localStorage.removeItem('token');
    return true;
  } catch (err) {
    return false;
  }
};
