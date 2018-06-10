import { handleResponse, getRequestOptions } from '../helpers/auth';

const register = user => {
  const requestOptions = {
    ...getRequestOptions('POST', false),
    body: JSON.stringify(user)
  };

  return fetch('/api/register', requestOptions).then(handleResponse);
};

const login = (email, password) => {
  const requestOptions = {
    ...getRequestOptions('POST', false),
    body: JSON.stringify({ email, password })
  };

  return fetch('/api/login', requestOptions).then(handleResponse);
}

const logout = () => {
  const requestOptions = getRequestOptions('GET');
  return fetch('/api/logout', requestOptions).then(handleResponse);
}

export const userService = {
  register,
  login,
  logout
};