import axios from 'axios';
import { handleResponse, handleError } from '../helpers/auth';

const register = user => {
  return axios.post('/api/register', user, { withCredentials: false }).then(handleResponse).catch(handleError);
};

const login = (email, password) => {
  return axios.post('/api/login', { email, password }, { withCredentials: false }).then(handleResponse).catch(handleError);
}

const logout = () => {
  return axios.get('/api/logout', { withCredentials: true }).then(handleResponse).catch(handleError);
}

export const userService = {
  register,
  login,
  logout
};