import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../../helpers/firebase-config';

export const loadUser = () => async dispatch => {
  try {
    onAuthStateChanged(auth, currentUser => {
      if (currentUser) {
        dispatch({ type: 'EXISTING_USER', payload: currentUser });
        localStorage.setItem('token', currentUser?.accessToken);
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

export const register = data => async () => {
  try {
    await createUserWithEmailAndPassword(auth, data?.email, data?.password);
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
