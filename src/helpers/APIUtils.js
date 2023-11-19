import axios from 'axios';
import { notification } from 'antd';
import store from '../redux/store';
import { logout } from '../redux/actions/authActions';

const TOKEN_NAME = process.env.REACT_APP_TOKEN_NAME;

class ApiUtils {
  constructor(message = false, request = true, appendAuth = true, response = true) {
    this.axios = axios.create({
      baseURL: ``,
    });

    if (request) {
      this.axios.interceptors.request.use(
        config => {
          const myConfig = { ...config };
          if (appendAuth) {
            const { auth } = store.getState();
            if (auth.isAuthenticated) myConfig.headers.authorization = auth.token;
          }
          return myConfig;
        },
        error => Promise.reject(error)
      );
    }

    if (response) {
      this.axios.interceptors.response.use(
        config => {
          const myConfig = { ...config };
          if (message) {
            notification.success({
              message: 'Success',
              description: myConfig.data.message,
            });
          }
          return myConfig;
        },
        error => {
          console.debug(error.response.data.status);
          if (error.response.data.status === 401 || error.response.data.status === 403) {
            const { auth } = store.getState();
            notification.error({
              message: 'Error',
              description: error.response.data.message,
            });
            localStorage.removeItem('token');
            if (auth.token) {
              store.dispatch(logout());
              setTimeout(() => window.location.assign('/login'), 1000);
            }
          } else {
            console.debug(error.response.data.status);
            notification.error({
              message: 'Error',
              description: error.response.data.message,
            });
          }
          return Promise.reject(error);
        }
      );
    }
  }

  forgotPassword = data =>
    this.axios({
      method: 'POST',
      url: '/users/forgot-password',
      data,
    });

  changePasswordGet = (id, token, headers) =>
    this.axios({
      method: 'GET',
      url: `/users/reset-password/${id}/${token}`,
      headers,
    });

  changePasswordPost = (id, token, data) =>
    this.axios({
      method: 'POST',
      url: `/users/reset-password/${id}/${token}`,
      data,
    });

  loadUser = headers =>
    this.axios({
      method: 'GET',
      url: '/users/me',
      headers,
    });

  getALlProducts = data =>
    this.axios({
      method: 'POST',
      url: '/product/',
      data,
    });
  suggestion = data =>
    this.axios({
      method: 'POST',
      url: '/product/suggestion',
      data,
    });

  updatePassword = (id, data) =>
    this.axios({
      method: 'PATCH',
      url: `/users/my-profile/edit-profile/change-password/${id}`,
      data,
    });

  addRestaurant = data =>
    this.axios({
      method: 'POST',
      url: 'https://vzgth5nw0m.execute-api.us-east-1.amazonaws.com/prod/insertRestaurantKeys',
      data,
    });
}

export default ApiUtils;
